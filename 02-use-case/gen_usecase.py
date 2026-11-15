import math, sys
from xml.sax.saxutils import escape

OUT = sys.argv[1] if len(sys.argv) > 1 else "."  # folder keluaran

STEP = 88
Y0 = 150
UW, UH = 340, 60
# (id, label, cx, row)
users = [
    ("U01", "Registrasi"),
    ("U02", "Login"),
    ("U03", "Lihat dashboard dan ringkasan aktivitas"),
    ("U04", "Kelola profil"),
    ("U05", "Ikuti modul pengantar level"),
    ("U06", "Ikuti challenge"),
    ("U07", "Catat pemilahan sampah"),
    ("U08", "Lihat streak, level, dan skor"),
    ("U09", "Lihat leaderboard"),
    ("U10", "Tukar reward"),
    ("U11", "Lihat komunitas dan event"),
    ("U13", "Buat event (level tertentu)"),
    ("U12", "Daftar event"),
]
admins = [
    ("A01", "Login"),
    ("A02", "Lihat dashboard statistik"),
    ("A03", "Kelola profil admin"),
    ("A04", "Kelola challenge"),
    ("A05", "Buat tantangan dadakan"),
    ("A06", "Pantau skor XP dan poin"),
    ("A07", "Kelola voucher dan reward"),
    ("A08", "Pantau event komunitas"),
]
UX, SX, AX = 470, 900, 1290
nodes = {}
for i, (k, l) in enumerate(users):
    nodes[k] = dict(label=l, cx=UX, cy=Y0 + i * STEP, w=UW, h=UH)
r7 = [i for i, (k, _) in enumerate(users) if k == "U07"][0]
y7 = Y0 + r7 * STEP
nodes["S1"] = dict(label="Unggah foto sampah", cx=SX, cy=y7 - STEP, w=300, h=UH)
nodes["S3"] = dict(label="Konfirmasi hasil deteksi", cx=SX, cy=y7, w=300, h=UH)
nodes["S2"] = dict(label="Deteksi jenis dan jumlah (AI)", cx=SX, cy=y7 + STEP, w=300, h=UH)
for i, (k, l) in enumerate(admins):
    nodes[k] = dict(label=l, cx=AX, cy=Y0 + i * STEP, w=UW, h=UH)

last_y = Y0 + (len(users) - 1) * STEP
BX, BY, BW = 270, 90, 1230
BH = last_y + 90 - BY
actors = {
    "User": dict(x=130, y=(Y0 + last_y) // 2 - 40),
    "Admin": dict(x=1640, y=Y0 + 3 * STEP - 20),
    "Model AI": dict(x=SX - 15, y=BY + BH + 50),
}
ACT_W, ACT_H = 40, 80
W, H = 1740, BY + BH + 50 + ACT_H + 70

assoc = [("User", k) for k, _ in users] + [("Admin", k) for k, _ in admins] + [("Model AI", "S2")]
rel = [("U07", "S1", "include"), ("U07", "S2", "include"), ("U07", "S3", "include"),
       ("U13", "U11", "extend"), ("A05", "A04", "extend")]


def center(name):
    if name in nodes:
        n = nodes[name]
        return n["cx"], n["cy"], n["w"] / 2, n["h"] / 2, "e"
    a = actors[name]
    return a["x"] + ACT_W / 2, a["y"] + ACT_H / 2, ACT_W / 2 + 6, ACT_H / 2, "r"


def clip(src, dst):
    x1, y1, a1, b1, t1 = center(src)
    x2, y2, a2, b2, t2 = center(dst)
    def edge_pt(cx, cy, a, b, t, tx, ty):
        dx, dy = tx - cx, ty - cy
        if t == "e":
            k = 1 / math.sqrt((dx / a) ** 2 + (dy / b) ** 2)
        else:
            k = min(a / abs(dx) if dx else 1e9, b / abs(dy) if dy else 1e9)
        return cx + dx * k, cy + dy * k
    return edge_pt(x1, y1, a1, b1, t1, x2, y2), edge_pt(x2, y2, a2, b2, t2, x1, y1)

# ---------- SVG ----------
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Arial, sans-serif">',
       '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#14302A" stroke-width="1.5"/></marker></defs>',
       f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>',
       f'<rect x="{BX}" y="{BY}" width="{BW}" height="{BH}" fill="#F3F6F1" stroke="#14302A" stroke-width="3"/>',
       f'<text x="{BX + BW / 2}" y="{BY + 40}" text-anchor="middle" font-size="26" font-weight="700" fill="#14302A">Sistem EcoHabbit (web)</text>']
def bus(actor, keys, spine, side):
    ys = [nodes[k]["cy"] for k in keys]
    ay = actors[actor]["y"] + 30
    ax = actors[actor]["x"] + (ACT_W + 18 if side == "L" else -18)
    lo, hi = min(ys + [ay]), max(ys + [ay])
    svg.append(f'<polyline points="{ax},{ay} {spine},{ay}" fill="none" stroke="#14302A" stroke-width="1.6"/>')
    svg.append(f'<line x1="{spine}" y1="{lo}" x2="{spine}" y2="{hi}" stroke="#14302A" stroke-width="1.6"/>')
    for k in keys:
        n = nodes[k]
        ex = n["cx"] - n["w"] / 2 if side == "L" else n["cx"] + n["w"] / 2
        svg.append(f'<line x1="{spine}" y1="{n["cy"]}" x2="{ex}" y2="{n["cy"]}" stroke="#14302A" stroke-width="1.6"/>')
bus("User", [k for k, _ in users], 225, "L")
bus("Admin", [k for k, _ in admins], 1545, "R")
(x1, y1), (x2, y2) = clip("Model AI", "S2")
svg.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#14302A" stroke-width="1.6"/>')
for a, b, kind in rel:
    (x1, y1), (x2, y2) = clip(a, b)
    svg.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#14302A" stroke-width="1.6" stroke-dasharray="8 6" marker-end="url(#ar)"/>')
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    ext = kind == "extend"
    svg.append(f'<text x="{mx + (14 if ext else 0):.1f}" y="{my + (6 if ext else -8):.1f}" text-anchor="{"start" if ext else "middle"}" font-size="18" font-style="italic" fill="#14302A" stroke="#F3F6F1" stroke-width="5" paint-order="stroke">«{kind}»</text>')
for k, n in nodes.items():
    fill = "#FFFFFF" if k[0] in "UA" else "#DCE7D9"
    svg.append(f'<ellipse cx="{n["cx"]}" cy="{n["cy"]}" rx="{n["w"] / 2}" ry="{n["h"] / 2}" fill="{fill}" stroke="#14302A" stroke-width="2.5"/>')
    words, lines, cur = n["label"].split(" "), [], ""
    for w_ in words:
        if len(cur + " " + w_) > 32 and cur:
            lines.append(cur); cur = w_
        else:
            cur = (cur + " " + w_).strip()
    lines.append(cur)
    y = n["cy"] - (len(lines) - 1) * 11 + 6
    for ln in lines:
        svg.append(f'<text x="{n["cx"]}" y="{y}" text-anchor="middle" font-size="19" font-weight="600" fill="#0F211B">{escape(ln)}</text>')
        y += 22
for name, a in actors.items():
    cx = a["x"] + ACT_W / 2
    svg.append(f'<g stroke="#14302A" stroke-width="3" fill="none"><circle cx="{cx}" cy="{a["y"] + 10}" r="10" fill="#FFFFFF"/>'
               f'<line x1="{cx}" y1="{a["y"] + 20}" x2="{cx}" y2="{a["y"] + 50}"/><line x1="{cx - 18}" y1="{a["y"] + 30}" x2="{cx + 18}" y2="{a["y"] + 30}"/>'
               f'<line x1="{cx}" y1="{a["y"] + 50}" x2="{cx - 16}" y2="{a["y"] + 75}"/><line x1="{cx}" y1="{a["y"] + 50}" x2="{cx + 16}" y2="{a["y"] + 75}"/></g>')
    svg.append(f'<text x="{cx}" y="{a["y"] + 102}" text-anchor="middle" font-size="22" font-weight="700" fill="#14302A">{name}</text>')
svg.append("</svg>")
open(f"{OUT}/use-case.svg", "w", encoding="utf-8").write("\n".join(svg))

# ---------- draw.io ----------
cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>']
cells.append(f'<mxCell id="boundary" value="Sistem EcoHabbit (web)" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F3F6F1;strokeColor=#14302A;strokeWidth=3;verticalAlign=top;fontStyle=1;fontSize=16;fontColor=#14302A;" vertex="1" parent="1"><mxGeometry x="{BX}" y="{BY}" width="{BW}" height="{BH}" as="geometry"/></mxCell>')
for name, a in actors.items():
    cells.append(f'<mxCell id="act_{name.replace(" ", "_")}" value="{name}" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;strokeColor=#14302A;strokeWidth=2;fontStyle=1;fontSize=14;fontColor=#14302A;" vertex="1" parent="1"><mxGeometry x="{a["x"]}" y="{a["y"]}" width="{ACT_W}" height="{ACT_H}" as="geometry"/></mxCell>')
for k, n in nodes.items():
    fill = "#FFFFFF" if k[0] in "UA" else "#DCE7D9"
    cells.append(f'<mxCell id="{k}" value="{escape(n["label"])}" style="ellipse;whiteSpace=wrap;html=1;fillColor={fill};strokeColor=#14302A;strokeWidth=2;fontColor=#0F211B;fontStyle=1;fontSize=13;" vertex="1" parent="1"><mxGeometry x="{n["cx"] - n["w"] / 2}" y="{n["cy"] - n["h"] / 2}" width="{n["w"]}" height="{n["h"]}" as="geometry"/></mxCell>')
eid = 0
def sid(x):
    return x if x in nodes else "act_" + x.replace(" ", "_")
for a, b in assoc:
    eid += 1
    if a == "User":
        st = "edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=1;exitY=0.33;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;"
    elif a == "Admin":
        st = "edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.33;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;"
    else:
        st = ""
    cells.append(f'<mxCell id="e{eid}" style="endArrow=none;html=1;strokeColor=#14302A;strokeWidth=1.5;{st}" edge="1" parent="1" source="{sid(a)}" target="{sid(b)}"><mxGeometry relative="1" as="geometry"/></mxCell>')
for a, b, kind in rel:
    eid += 1
    cells.append(f'<mxCell id="e{eid}" value="&lt;&lt;{kind}&gt;&gt;" style="endArrow=open;endSize=10;dashed=1;html=1;strokeColor=#14302A;strokeWidth=1.5;fontStyle=2;fontSize=12;" edge="1" parent="1" source="{a}" target="{b}"><mxGeometry relative="1" as="geometry"/></mxCell>')
xml = ('<mxfile host="app.diagrams.net"><diagram id="usecase" name="Use Case"><mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1800" pageHeight="1600" math="0" shadow="0"><root>'
       + "".join(cells) + '</root></mxGraphModel></diagram></mxfile>')
open(f"{OUT}/use-case.drawio", "w", encoding="utf-8").write(xml)
print("ok", W, H)
