"use client";

import { useEffect, useRef, useState } from "react";
import { patientData } from "@/lib/data/patients";
import { cn } from "@/lib/utils";

interface DigitalTwinHologramProps {
  patientId: string;
  className?: string;
}

type GltfAccessor = {
  bufferView?: number;
  byteOffset?: number;
  componentType: number;
  count: number;
  type: "SCALAR" | "VEC2" | "VEC3" | "VEC4";
  min?: number[];
  max?: number[];
};

type GltfBufferView = {
  buffer: number;
  byteOffset?: number;
  byteLength: number;
  byteStride?: number;
};

type GltfPrimitive = {
  attributes: { POSITION?: number };
  indices?: number;
};

type GltfDocument = {
  accessors: GltfAccessor[];
  bufferViews: GltfBufferView[];
  meshes?: { primitives: GltfPrimitive[] }[];
};

type MeshPart = {
  position: WebGLBuffer;
  index?: WebGLBuffer;
  vertexCount: number;
  indexCount: number;
  indexType: number;
};

type AccessorTypedArray = Float32Array | Uint16Array | Uint32Array;

type AccessorArrayConstructor<T extends AccessorTypedArray> = {
  new (buffer: ArrayBuffer, byteOffset: number, length: number): T;
  BYTES_PER_ELEMENT: number;
};

const COMPONENT_BYTES: Record<number, number> = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4,
};

const TYPE_COMPONENTS: Record<GltfAccessor["type"], number> = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
};

function readGlb(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  if (view.getUint32(0, true) !== 0x46546c67) {
    throw new Error("Invalid hologram model");
  }

  let offset = 12;
  let json: GltfDocument | null = null;
  let bin: ArrayBuffer | null = null;

  while (offset < view.byteLength) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    const chunkStart = offset + 8;

    if (chunkType === 0x4e4f534a) {
      const text = new TextDecoder().decode(new Uint8Array(buffer, chunkStart, chunkLength));
      json = JSON.parse(text) as GltfDocument;
    }

    if (chunkType === 0x004e4942) {
      bin = buffer.slice(chunkStart, chunkStart + chunkLength);
    }

    offset = chunkStart + chunkLength;
  }

  if (!json || !bin) throw new Error("Incomplete hologram model");
  return { json, bin };
}

function getAccessorArray<T extends Float32Array | Uint16Array | Uint32Array>(
  json: GltfDocument,
  bin: ArrayBuffer,
  accessorIndex: number,
  ArrayType: AccessorArrayConstructor<T>
) {
  const accessor = json.accessors[accessorIndex];
  const bufferView = accessor.bufferView === undefined ? undefined : json.bufferViews[accessor.bufferView];
  if (!bufferView) throw new Error("Missing hologram geometry");

  const components = TYPE_COMPONENTS[accessor.type];
  const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
  const itemBytes = COMPONENT_BYTES[accessor.componentType] * components;
  const stride = bufferView.byteStride || itemBytes;
  const length = accessor.count * components;

  if (stride === itemBytes) {
    return new ArrayType(bin, byteOffset, length);
  }

  const source = new DataView(bin, byteOffset, bufferView.byteLength - (accessor.byteOffset || 0));
  const target = new ArrayType(new ArrayBuffer(length * ArrayType.BYTES_PER_ELEMENT), 0, length);

  for (let item = 0; item < accessor.count; item += 1) {
    for (let component = 0; component < components; component += 1) {
      const readAt = item * stride + component * COMPONENT_BYTES[accessor.componentType];
      target[item * components + component] = source.getFloat32(readAt, true);
    }
  }

  return target;
}

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const range = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * range, -1,
    0, 0, near * far * range * 2, 0,
  ]);
}

function multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

function modelView(time: number, center: number[], scale: number) {
  const yaw = time * 0.48;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const tx = -(c * center[0] + s * center[2]) * scale;
  const ty = -center[1] * scale - 0.12;
  const tz = -(-s * center[0] + c * center[2]) * scale - 3.55;

  return new Float32Array([
    c * scale, 0, -s * scale, 0,
    0, scale, 0, 0,
    s * scale, 0, c * scale, 0,
    tx, ty, tz, 1,
  ]);
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create hologram shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "Unable to compile hologram shader");
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compile(
    gl,
    gl.VERTEX_SHADER,
    `
      attribute vec3 aPosition;
      uniform mat4 uMvp;
      uniform float uMirror;
      varying vec3 vPosition;
      void main() {
        vec3 position = vec3(aPosition.x * uMirror, aPosition.y, aPosition.z);
        vPosition = position;
        gl_PointSize = 1.8;
        gl_Position = uMvp * vec4(position, 1.0);
      }
    `
  );

  const fragment = compile(
    gl,
    gl.FRAGMENT_SHADER,
    `
      precision mediump float;
      uniform vec3 uColor;
      uniform float uTime;
      varying vec3 vPosition;
      void main() {
        float scan = 0.5 + 0.5 * sin((vPosition.y * 24.0) + (uTime * 4.0));
        float pulse = 0.86 + (scan * 0.12);
        gl_FragColor = vec4(uColor * pulse, 0.74);
      }
    `
  );

  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create hologram program");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "Unable to link hologram program");
  }
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
}

export function DigitalTwinHologram({ patientId, className }: DigitalTwinHologramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const patient = patientData[patientId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !patient) return;

    let animationFrame = 0;
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });

    if (!gl) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const canvasEl = canvas;
    const glContext = gl;

    const accent =
      patient.risk === "cr" ? [1, 0.34, 0.42] : patient.risk === "hi" ? [1, 0.72, 0.22] : [0.25, 0.88, 1];

    async function renderHologram() {
      try {
        const response = await fetch("/MaleHologram.glb");
        if (!response.ok) throw new Error("Unable to load hologram");

        const { json, bin } = readGlb(await response.arrayBuffer());
        const program = createProgram(glContext);
        const positionLocation = glContext.getAttribLocation(program, "aPosition");
        const mvpLocation = glContext.getUniformLocation(program, "uMvp");
        const colorLocation = glContext.getUniformLocation(program, "uColor");
        const timeLocation = glContext.getUniformLocation(program, "uTime");
        const mirrorLocation = glContext.getUniformLocation(program, "uMirror");
        const parts: MeshPart[] = [];
        const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };

        for (const mesh of json.meshes || []) {
          for (const primitive of mesh.primitives) {
            if (primitive.attributes.POSITION === undefined) continue;

            const positionAccessor = json.accessors[primitive.attributes.POSITION];
            const positions = getAccessorArray(json, bin, primitive.attributes.POSITION, Float32Array);
            const position = glContext.createBuffer();
            if (!position) continue;

            glContext.bindBuffer(glContext.ARRAY_BUFFER, position);
            glContext.bufferData(glContext.ARRAY_BUFFER, positions, glContext.STATIC_DRAW);

            positionAccessor.min?.forEach((value, index) => {
              bounds.min[index] = Math.min(bounds.min[index], value);
            });
            positionAccessor.max?.forEach((value, index) => {
              bounds.max[index] = Math.max(bounds.max[index], value);
            });

            let index: WebGLBuffer | undefined;
            let indexCount = 0;
            let indexType: number = glContext.UNSIGNED_SHORT;

            if (primitive.indices !== undefined) {
              const accessor = json.accessors[primitive.indices];
              const ArrayType: AccessorArrayConstructor<Uint16Array | Uint32Array> =
                accessor.componentType === 5125 ? Uint32Array : Uint16Array;
              const indices = getAccessorArray(json, bin, primitive.indices, ArrayType);
              index = glContext.createBuffer() || undefined;
              indexCount = accessor.count;
              indexType = accessor.componentType === 5125 ? glContext.UNSIGNED_INT : glContext.UNSIGNED_SHORT;
              glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, index || null);
              glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, indices, glContext.STATIC_DRAW);
            }

            parts.push({ position, index, vertexCount: positionAccessor.count, indexCount, indexType });
          }
        }

        if (!parts.length) throw new Error("No hologram geometry found");

        const ext = glContext.getExtension("OES_element_index_uint");
        if (!ext && parts.some((part) => part.indexType === glContext.UNSIGNED_INT)) {
          throw new Error("This browser cannot read the hologram mesh");
        }

        const mirroredX = bounds.max[0] <= 0 || bounds.min[0] >= 0;
        const center = bounds.min.map((min, index) => (min + bounds.max[index]) / 2);
        if (mirroredX) center[0] = 0;
        const width = mirroredX ? Math.max(Math.abs(bounds.min[0]), Math.abs(bounds.max[0])) * 2 : bounds.max[0] - bounds.min[0];
        const size = Math.max(width, bounds.max[1] - bounds.min[1], bounds.max[2] - bounds.min[2]);
        const scale = size > 0 ? 1.95 / size : 1;

        const resize = () => {
          const rect = canvasEl.getBoundingClientRect();
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          canvasEl.width = Math.max(1, Math.round(rect.width * ratio));
          canvasEl.height = Math.max(1, Math.round(rect.height * ratio));
          glContext.viewport(0, 0, canvasEl.width, canvasEl.height);
        };

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvasEl);
        resize();

        glContext.useProgram(program);
        glContext.enable(glContext.BLEND);
        glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
        glContext.enable(glContext.DEPTH_TEST);
        glContext.depthFunc(glContext.LEQUAL);
        glContext.depthMask(true);
        glContext.clearColor(0, 0, 0, 0);
        setIsLoading(false);

        const frame = (now: number) => {
          if (cancelled) return;

          const t = now * 0.001;
          glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
          glContext.useProgram(program);
          glContext.uniform3fv(colorLocation, new Float32Array(accent));
          glContext.uniform1f(timeLocation, t);

          const aspect = canvasEl.width / Math.max(canvasEl.height, 1);
          const projection = perspective(Math.PI / 4.5, aspect, 0.1, 100);
          const view = modelView(t * 0.45, center, scale);
          glContext.uniformMatrix4fv(mvpLocation, false, multiply(projection, view));

          for (const mirror of mirroredX ? [1, -1] : [1]) {
            glContext.uniform1f(mirrorLocation, mirror);

            for (const part of parts) {
              glContext.bindBuffer(glContext.ARRAY_BUFFER, part.position);
              glContext.enableVertexAttribArray(positionLocation);
              glContext.vertexAttribPointer(positionLocation, 3, glContext.FLOAT, false, 0, 0);

              if (part.index) {
                glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, part.index);
                glContext.drawElements(glContext.TRIANGLES, part.indexCount, part.indexType, 0);
              } else {
                glContext.drawArrays(glContext.TRIANGLES, 0, part.vertexCount);
              }

              glContext.drawArrays(glContext.POINTS, 0, part.vertexCount);
            }
          }

          animationFrame = requestAnimationFrame(frame);
        };

        animationFrame = requestAnimationFrame(frame);
      } catch {
        if (!cancelled) {
          setIsLoading(false);
          setHasError(true);
        }
      }
    }

    renderHologram();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
    };
  }, [patient, patientId]);

  if (!patient) return null;

  return (
    <div className={cn("relative isolate flex min-h-0 w-full items-center justify-center overflow-hidden", className)}>
      <div className="absolute bottom-[8%] h-[18%] w-[64%] rounded-full border border-cyan-300/20 bg-cyan-300/5 shadow-[0_0_42px_rgba(34,211,238,0.18)]" />
      <div className="absolute bottom-[12%] h-[9%] w-[44%] rounded-full border border-white/10" />
      <canvas ref={canvasRef} className="relative z-10 h-full w-full" aria-label="Patient digital twin hologram" />
      {(isLoading || hasError) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-cyan-100/70">
          {hasError ? "Hologram unavailable" : "Loading hologram"}
        </div>
      )}
    </div>
  );
}
