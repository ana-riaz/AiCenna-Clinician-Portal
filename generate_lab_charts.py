#!/usr/bin/env python3
"""
Generate per-patient lab trend charts using matplotlib.
Each test that was ever CRITICAL gets its own subplot.
Output: public/labs/{patientId}_labs.png
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Patch
from datetime import datetime
import re
import os

# =============================================================================
# LAB DATA (mirrors lib/data/patients.ts)
# =============================================================================

patients = {
    "ahmed": {
        "name": "Ahmed Khan",
        "labs": [
            {
                "name": "CBC with Differential",
                "date": "Mar 15, 2025",
                "rows": [
                    {"test": "Hemoglobin",              "val": "14.4 g/dL",     "ref": "11.6–15.0",  "flag": "NORMAL"},
                    {"test": "Hematocrit",               "val": "43.2 %",        "ref": "35.5–44.9",  "flag": "NORMAL"},
                    {"test": "WBC (Leukocytes)",         "val": "8.6 x10/L",     "ref": "3.4–9.6",    "flag": "NORMAL"},
                    {"test": "Platelet Count",           "val": "142 x10/L",     "ref": "157–371",    "flag": "CRITICAL"},
                    {"test": "Lymphocytes",              "val": "46 %",          "ref": "18–42",      "flag": "CRITICAL"},
                    {"test": "Neutrophilic Segs",        "val": "36 %",          "ref": "50–75",      "flag": "CRITICAL"},
                    {"test": "Undifferentiated Blasts",  "val": "0 %",           "ref": "< 1",            "flag": "NORMAL"},
                ],
            },
            {
                "name": "CBC with Differential",
                "date": "Aug 5, 2025",
                "rows": [
                    {"test": "Hemoglobin",              "val": "14.8 g/dL",     "ref": "11.6–15.0",  "flag": "NORMAL"},
                    {"test": "Hematocrit",               "val": "44.6 %",        "ref": "35.5–44.9",  "flag": "CRITICAL"},
                    {"test": "WBC (Leukocytes)",         "val": "9.2 x10/L",     "ref": "3.4–9.6",    "flag": "NORMAL"},
                    {"test": "Platelet Count",           "val": "118 x10/L",     "ref": "157–371",    "flag": "CRITICAL"},
                    {"test": "Lymphocytes",              "val": "49 %",          "ref": "18–42",      "flag": "CRITICAL"},
                    {"test": "Neutrophilic Segs",        "val": "28 %",          "ref": "50–75",      "flag": "CRITICAL"},
                    {"test": "Undifferentiated Blasts",  "val": "1.2 %",         "ref": "< 1",            "flag": "CRITICAL"},
                ],
            },
            {
                "name": "CBC with Differential",
                "date": "Feb 10, 2026",
                "rows": [
                    {"test": "Hemoglobin",              "val": "14.6 g/dL",     "ref": "11.6–15.0",  "flag": "NORMAL"},
                    {"test": "Hematocrit",               "val": "43.8 %",        "ref": "35.5–44.9",  "flag": "NORMAL"},
                    {"test": "WBC (Leukocytes)",         "val": "8.9 x10/L",     "ref": "3.4–9.6",    "flag": "NORMAL"},
                    {"test": "Platelet Count",           "val": "89 x10/L",      "ref": "157–371",    "flag": "CRITICAL"},
                    {"test": "Lymphocytes",              "val": "52 %",          "ref": "18–42",      "flag": "CRITICAL"},
                    {"test": "Neutrophilic Segs",        "val": "24 %",          "ref": "50–75",      "flag": "CRITICAL"},
                    {"test": "Undifferentiated Blasts",  "val": "2 %",           "ref": "< 1",            "flag": "CRITICAL"},
                ],
            },
            {
                "name": "CBC with Differential",
                "date": "May 7, 2026",
                "rows": [
                    {"test": "Hemoglobin",              "val": "15.1 g/dL",     "ref": "11.6–15.0",  "flag": "CRITICAL"},
                    {"test": "Hematocrit",               "val": "45.4 %",        "ref": "35.5–44.9",  "flag": "CRITICAL"},
                    {"test": "WBC (Leukocytes)",         "val": "10.4 x10/L",    "ref": "3.4–9.6",    "flag": "CRITICAL"},
                    {"test": "Platelet Count",           "val": "52 x10/L",      "ref": "157–371",    "flag": "CRITICAL"},
                    {"test": "Lymphocytes",              "val": "67 %",          "ref": "18–42",      "flag": "CRITICAL"},
                    {"test": "Neutrophilic Segs",        "val": "11 %",          "ref": "50–75",      "flag": "CRITICAL"},
                    {"test": "Undifferentiated Blasts",  "val": "5 %",           "ref": "< 1",            "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Kidney Function Test",
                "date": "Feb 15, 2024",
                "rows": [
                    {"test": "Serum Creatinine",  "val": "0.92 mg/dL",  "ref": "0.55–1.02",  "flag": "NORMAL"},
                    {"test": "eGFR",              "val": "88.5",         "ref": "> 60",             "flag": "NORMAL"},
                ],
            },
            {
                "name": "Kidney Function Test",
                "date": "Jun 20, 2024",
                "rows": [
                    {"test": "Serum Creatinine",  "val": "1.18 mg/dL",  "ref": "0.55–1.02",  "flag": "CRITICAL"},
                    {"test": "eGFR",              "val": "71.4",         "ref": "> 60",             "flag": "NORMAL"},
                ],
            },
            {
                "name": "Kidney Function Test",
                "date": "Oct 10, 2024",
                "rows": [
                    {"test": "Serum Creatinine",  "val": "1.63 mg/dL",  "ref": "0.55–1.02",  "flag": "CRITICAL"},
                    {"test": "eGFR",              "val": "58.03",        "ref": "> 60",             "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Kidney Function Test",
                "date": "Jan 28, 2026",
                "rows": [
                    {"test": "Serum Creatinine",  "val": "1.89 mg/dL",  "ref": "0.55–1.02",  "flag": "CRITICAL"},
                    {"test": "eGFR",              "val": "49.2",         "ref": "> 60",             "flag": "CRITICAL"},
                ],
            },
        ],
    },

    "fatima": {
        "name": "Fatima Rehman",
        "labs": [
            {
                "name": "HbA1c & Biochemistry",
                "date": "Aug 15, 2023",
                "rows": [
                    {"test": "HbA1c",                "val": "5.7 %",        "ref": "< 5.7",   "flag": "CRITICAL"},
                    {"test": "Est. Average Glucose",  "val": "117.0 mg/dL", "ref": "< 100",   "flag": "CRITICAL"},
                ],
            },
            {
                "name": "HbA1c & Biochemistry",
                "date": "Feb 10, 2024",
                "rows": [
                    {"test": "HbA1c",                "val": "5.8 %",        "ref": "< 5.7",   "flag": "CRITICAL"},
                    {"test": "Est. Average Glucose",  "val": "119.8 mg/dL", "ref": "< 100",   "flag": "CRITICAL"},
                ],
            },
            {
                "name": "HbA1c & Biochemistry",
                "date": "May 20, 2024",
                "rows": [
                    {"test": "HbA1c",                "val": "5.8 %",         "ref": "< 5.7",  "flag": "CRITICAL"},
                    {"test": "Est. Average Glucose",  "val": "120.30 mg/dL", "ref": "< 100",  "flag": "CRITICAL"},
                ],
            },
            {
                "name": "HbA1c & Biochemistry",
                "date": "Nov 11, 2024",
                "rows": [
                    {"test": "HbA1c",                "val": "6.0 %",         "ref": "< 5.7",  "flag": "CRITICAL"},
                    {"test": "Est. Average Glucose",  "val": "126.55 mg/dL", "ref": "< 100",  "flag": "CRITICAL"},
                ],
            },
        ],
    },

    "sara": {
        "name": "Sara Malik",
        "labs": [
            {
                "name": "Post-Op CBC",
                "date": "Apr 23, 2026",
                "rows": [
                    {"test": "WBC",        "val": "15.8 x10/L",  "ref": "4.5–11.0",  "flag": "CRITICAL"},
                    {"test": "Hemoglobin", "val": "10.2 g/dL",   "ref": "12.0–16.0", "flag": "CRITICAL"},
                    {"test": "CRP",        "val": "4.8 mg/L",    "ref": "< 3.0",          "flag": "CRITICAL"},
                    {"test": "ESR",        "val": "42 mm/hr",    "ref": "< 20",           "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Post-Op CBC",
                "date": "Apr 26, 2026",
                "rows": [
                    {"test": "WBC",        "val": "11.2 x10/L",  "ref": "4.5–11.0",  "flag": "CRITICAL"},
                    {"test": "Hemoglobin", "val": "11.8 g/dL",   "ref": "12.0–16.0", "flag": "CRITICAL"},
                    {"test": "CRP",        "val": "2.1 mg/L",    "ref": "< 3.0",          "flag": "NORMAL"},
                    {"test": "ESR",        "val": "28 mm/hr",    "ref": "< 20",           "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Post-Op CBC",
                "date": "Apr 30, 2026",
                "rows": [
                    {"test": "WBC",        "val": "9.4 x10/L",   "ref": "4.5–11.0",  "flag": "NORMAL"},
                    {"test": "Hemoglobin", "val": "12.1 g/dL",   "ref": "12.0–16.0", "flag": "NORMAL"},
                    {"test": "CRP",        "val": "1.8 mg/L",    "ref": "< 3.0",          "flag": "NORMAL"},
                    {"test": "ESR",        "val": "22 mm/hr",    "ref": "< 20",           "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Post-Op CBC",
                "date": "May 5, 2026",
                "rows": [
                    {"test": "WBC",        "val": "7.8 x10/L",   "ref": "4.5–11.0",  "flag": "NORMAL"},
                    {"test": "Hemoglobin", "val": "12.6 g/dL",   "ref": "12.0–16.0", "flag": "NORMAL"},
                    {"test": "CRP",        "val": "1.2 mg/L",    "ref": "< 3.0",          "flag": "NORMAL"},
                    {"test": "ESR",        "val": "15 mm/hr",    "ref": "< 20",           "flag": "NORMAL"},
                ],
            },
        ],
    },

    "omar": {
        "name": "Omar Farooq",
        "labs": [
            {
                "name": "Lipid Profile",
                "date": "Mar 22, 2024",
                "rows": [
                    {"test": "Total Cholesterol", "val": "248 mg/dL", "ref": "< 200", "flag": "CRITICAL"},
                    {"test": "LDL",               "val": "168 mg/dL", "ref": "< 130", "flag": "CRITICAL"},
                    {"test": "HDL",               "val": "38 mg/dL",  "ref": "> 40",  "flag": "CRITICAL"},
                    {"test": "Triglycerides",     "val": "195 mg/dL", "ref": "< 150", "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Lipid Profile",
                "date": "Sep 18, 2024",
                "rows": [
                    {"test": "Total Cholesterol", "val": "232 mg/dL", "ref": "< 200", "flag": "CRITICAL"},
                    {"test": "LDL",               "val": "158 mg/dL", "ref": "< 130", "flag": "CRITICAL"},
                    {"test": "HDL",               "val": "41 mg/dL",  "ref": "> 40",  "flag": "NORMAL"},
                    {"test": "Triglycerides",     "val": "178 mg/dL", "ref": "< 150", "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Lipid Profile",
                "date": "Mar 10, 2025",
                "rows": [
                    {"test": "Total Cholesterol", "val": "224 mg/dL", "ref": "< 200", "flag": "CRITICAL"},
                    {"test": "LDL",               "val": "148 mg/dL", "ref": "< 130", "flag": "CRITICAL"},
                    {"test": "HDL",               "val": "44 mg/dL",  "ref": "> 40",  "flag": "NORMAL"},
                    {"test": "Triglycerides",     "val": "162 mg/dL", "ref": "< 150", "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Lipid Profile",
                "date": "Sep 15, 2025",
                "rows": [
                    {"test": "Total Cholesterol", "val": "218 mg/dL", "ref": "< 200", "flag": "CRITICAL"},
                    {"test": "LDL",               "val": "142 mg/dL", "ref": "< 130", "flag": "CRITICAL"},
                    {"test": "HDL",               "val": "46 mg/dL",  "ref": "> 40",  "flag": "NORMAL"},
                    {"test": "Triglycerides",     "val": "155 mg/dL", "ref": "< 150", "flag": "CRITICAL"},
                ],
            },
            {
                "name": "Lipid Profile",
                "date": "Mar 12, 2026",
                "rows": [
                    {"test": "Total Cholesterol", "val": "214 mg/dL", "ref": "< 200", "flag": "CRITICAL"},
                    {"test": "LDL",               "val": "138 mg/dL", "ref": "< 130", "flag": "CRITICAL"},
                    {"test": "HDL",               "val": "48 mg/dL",  "ref": "> 40",  "flag": "NORMAL"},
                    {"test": "Triglycerides",     "val": "152 mg/dL", "ref": "< 150", "flag": "CRITICAL"},
                ],
            },
        ],
    },
}

# =============================================================================
# HELPERS
# =============================================================================

def parse_val(val_str):
    """Extract leading numeric from '14.4 g/dL', '142 x10/L', '5.7 %' etc."""
    m = re.match(r'^\s*([\d.]+)', val_str)
    return float(m.group(1)) if m else None


def parse_ref(ref_str):
    """
    Returns (low, high) — None means no bound on that side.
    Handles: '11.6–15.0'  '< 5.7'  '> 60'  '6–22'
    """
    # strip units / letters / % but keep digits, dots, dashes, < >
    ref = ref_str.strip()
    ref_clean = re.sub(r'[%a-zA-Z]', '', ref).strip()

    # Range: digits – digits  (en-dash – or plain hyphen, but not leading -)
    m = re.match(r'^([\d.]+)\s*[–\-]\s*([\d.]+)$', ref_clean)
    if m:
        return (float(m.group(1)), float(m.group(2)))

    # Upper bound:  < X
    m = re.match(r'^<\s*([\d.]+)', ref_clean)
    if m:
        return (None, float(m.group(1)))

    # Lower bound:  > X
    m = re.match(r'^>\s*([\d.]+)', ref_clean)
    if m:
        return (float(m.group(1)), None)

    return (None, None)


def parse_date(date_str):
    return datetime.strptime(date_str.strip(), "%b %d, %Y")


def get_unit(val_str):
    """Return unit portion: 'g/dL', '%', 'mg/dL', '' etc."""
    m = re.match(r'^\s*[\d.]+\s*(.*)', val_str)
    if m:
        unit = m.group(1).strip()
        # clean superscript artefacts
        unit = re.sub(r'x10.*', '', unit).strip()
        return unit
    return ''


# =============================================================================
# STYLE TOKENS  (dark theme matching the app)
# =============================================================================

BG_FIG         = '#0d1117'
BG_AX          = '#161b22'
BORDER         = '#30363d'
TEXT_INK       = '#e6edf3'
TEXT_MUTED     = '#8b949e'
COLOR_OK       = '#3fb950'    # green dot
COLOR_CRIT     = '#f85149'    # red dot
COLOR_LINE     = '#58a6ff'    # trend line
REF_FILL       = (0.063, 0.478, 0.314, 0.13)
REF_EDGE       = (0.063, 0.478, 0.314, 0.55)


# =============================================================================
# CHART BUILDER
# =============================================================================

def build_chart(patient_id, patient, out_dir):
    name = patient["name"]
    labs = patient["labs"]

    # 1. Which tests were ever CRITICAL?
    ever_critical = set()
    for lab in labs:
        for row in lab["rows"]:
            if row["flag"] == "CRITICAL":
                ever_critical.add(row["test"])

    if not ever_critical:
        print(f"  [skip] {name}: no critical tests")
        return

    # 2. Collect time-series per test (include ALL readings for ever-critical tests)
    series = {}   # test -> {points, ref, unit}
    for lab in labs:
        lab_date = parse_date(lab["date"])
        for row in lab["rows"]:
            tname = row["test"]
            if tname not in ever_critical:
                continue
            v = parse_val(row["val"])
            if v is None:
                continue
            if tname not in series:
                series[tname] = {
                    "points": [],
                    "ref":    row["ref"],
                    "unit":   get_unit(row["val"]),
                }
            series[tname]["points"].append({
                "date": lab_date,
                "val":  v,
                "flag": row["flag"],
            })

    for tname in series:
        series[tname]["points"].sort(key=lambda p: p["date"])

    # 3. Layout
    n  = len(series)
    nc = min(3, n)
    nr = (n + nc - 1) // nc

    fw = nc * 4.4 + 0.6
    fh = nr * 3.4 + 1.0

    fig, axes = plt.subplots(nr, nc, figsize=(fw, fh))
    fig.patch.set_facecolor(BG_FIG)

    # normalise axes to 1-D list
    if n == 1:
        axes_flat = [axes]
    elif nr == 1:
        axes_flat = list(axes)
    else:
        axes_flat = list(axes.flatten())

    for idx, (tname, s) in enumerate(series.items()):
        ax = axes_flat[idx]
        pts   = s["points"]
        dates = [p["date"] for p in pts]
        vals  = [p["val"]  for p in pts]
        flags = [p["flag"] for p in pts]
        ref   = s["ref"]
        unit  = s["unit"]
        low, high = parse_ref(ref)

        # — axes chrome —
        ax.set_facecolor(BG_AX)
        for spine in ax.spines.values():
            spine.set_color(BORDER)
            spine.set_linewidth(0.8)
        ax.tick_params(colors=TEXT_MUTED, labelsize=7, length=3, width=0.8)
        ax.yaxis.grid(True, color=BORDER, linewidth=0.5, alpha=0.7, zorder=0)
        ax.set_axisbelow(True)
        ax.xaxis.grid(False)

        # — Y limits —
        cands = vals[:]
        if low  is not None: cands.append(low)
        if high is not None: cands.append(high)
        ymin = min(cands)
        ymax = max(cands)
        span = (ymax - ymin) if ymax != ymin else max(abs(ymax) * 0.2, 0.5)
        y_lo = ymin - span * 0.20
        y_hi = ymax + span * 0.22
        ax.set_ylim(y_lo, y_hi)

        # — reference range band —
        if low is not None and high is not None:
            ax.axhspan(low, high, color=REF_FILL, linewidth=0, zorder=1)
            ax.axhline(low,  color=REF_EDGE, linewidth=0.9, linestyle='--', zorder=2)
            ax.axhline(high, color=REF_EDGE, linewidth=0.9, linestyle='--', zorder=2)
            ax.annotate(f'{low}', xy=(dates[0], low), xytext=(2, 3),
                        textcoords='offset points', fontsize=6,
                        color=REF_EDGE, va='bottom')
            ax.annotate(f'{high}', xy=(dates[0], high), xytext=(2, -8),
                        textcoords='offset points', fontsize=6,
                        color=REF_EDGE, va='top')
        elif high is not None:
            ax.axhspan(y_lo, high, color=REF_FILL, linewidth=0, zorder=1)
            ax.axhline(high, color=REF_EDGE, linewidth=0.9, linestyle='--', zorder=2)
            ax.annotate(f'< {high}', xy=(dates[0], high), xytext=(2, -8),
                        textcoords='offset points', fontsize=6,
                        color=REF_EDGE, va='top')
        elif low is not None:
            ax.axhspan(low, y_hi, color=REF_FILL, linewidth=0, zorder=1)
            ax.axhline(low, color=REF_EDGE, linewidth=0.9, linestyle='--', zorder=2)
            ax.annotate(f'> {low}', xy=(dates[0], low), xytext=(2, 3),
                        textcoords='offset points', fontsize=6,
                        color=REF_EDGE, va='bottom')

        # — trend line —
        ax.plot(dates, vals,
                color=COLOR_LINE, linewidth=1.6, zorder=3,
                solid_capstyle='round', solid_joinstyle='round')

        # — dots —
        for d, v, f in zip(dates, vals, flags):
            dot_color = COLOR_CRIT if f == "CRITICAL" else COLOR_OK
            ax.plot(d, v, 'o',
                    color=dot_color, markersize=5.5, zorder=4,
                    markeredgecolor=BG_AX, markeredgewidth=1.2)

        # — x-axis format: dd/mm/yy —
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m/%y'))
        # choose tick density based on number of points
        if len(dates) <= 5:
            ax.xaxis.set_major_locator(mdates.AutoDateLocator(minticks=2, maxticks=6))
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=38, ha='right', fontsize=6.5)

        # — y label —
        if unit:
            ax.set_ylabel(unit, fontsize=7, color=TEXT_MUTED, labelpad=3)

        # — subplot title —
        ax.set_title(tname, fontsize=8.5, fontweight='bold',
                     color=TEXT_INK, pad=5, loc='left')

    # hide unused axes
    for j in range(n, len(axes_flat)):
        axes_flat[j].set_visible(False)

    # — figure title —
    fig.suptitle(f'{name}  —  Lab Trends', fontsize=11, fontweight='bold',
                 color=TEXT_INK, y=0.99, x=0.012, ha='left')

    # — legend (top-right) —
    legend_handles = [
        Patch(facecolor=REF_FILL, edgecolor=REF_EDGE, linewidth=0.8,
              label='Reference range'),
        plt.Line2D([0], [0], marker='o', linestyle='none',
                   markerfacecolor=COLOR_CRIT, markeredgecolor=BG_AX,
                   markeredgewidth=0.8, markersize=6, label='Critical'),
        plt.Line2D([0], [0], marker='o', linestyle='none',
                   markerfacecolor=COLOR_OK, markeredgecolor=BG_AX,
                   markeredgewidth=0.8, markersize=6, label='Normal'),
    ]
    fig.legend(handles=legend_handles, loc='upper right', fontsize=7.5,
               facecolor=BG_AX, edgecolor=BORDER, labelcolor=TEXT_MUTED,
               framealpha=0.92, bbox_to_anchor=(0.995, 0.996))

    plt.tight_layout(rect=[0, 0, 1, 0.965])

    out_path = os.path.join(out_dir, f'{patient_id}_labs.png')
    fig.savefig(out_path, dpi=150, bbox_inches='tight',
                facecolor=BG_FIG, edgecolor='none')
    plt.close(fig)
    print(f"  saved -> {out_path}")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_dir    = os.path.join(script_dir, 'public', 'labs')
    os.makedirs(out_dir, exist_ok=True)
    print(f'Output dir: {out_dir}\n')

    for pid, pdata in patients.items():
        print(f'Generating: {pdata["name"]}')
        build_chart(pid, pdata, out_dir)

    print('\nAll done.')
