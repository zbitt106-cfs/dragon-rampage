# Generates the PWA icons + iOS splash for Dragon Rampage (cartoony dragon head).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
D=os.path.dirname(os.path.abspath(__file__))
def grad(w,h,top,bot):
    im=Image.new('RGB',(w,h));px=im.load()
    for y in range(h):
        t=y/(h-1);c=tuple(int(top[i]+(bot[i]-top[i])*t) for i in range(3))
        for x in range(w):px[x,y]=c
    return im
def dragon(S):
    """Draw dragon head on an S x S RGBA layer."""
    L=Image.new('RGBA',(S,S),(0,0,0,0));d=ImageDraw.Draw(L)
    s=S/1000
    def P(pts):return [(x*s,y*s) for x,y in pts]
    def E(b):return [v*s for v in b]
    OL=(40,14,10,255);W=int(16*s)
    G=(214,52,38,255);GD=(160,30,24,255);BEL=(255,196,92,255);HORN=(255,232,170,255)
    # horns
    d.polygon(P([(330,330),(250,110),(410,290)]),fill=HORN,outline=OL,width=W)
    d.polygon(P([(560,300),(640,95),(680,330)]),fill=HORN,outline=OL,width=W)
    # back spikes
    for (a,b,c) in [((180,520),(90,470),(200,450)),((175,640),(80,620),(190,580)),((200,750),(110,770),(220,700))]:
        d.polygon(P([a,b,c]),fill=GD,outline=OL,width=W)
    # neck
    d.polygon(P([(200,560),(420,600),(470,1000),(170,1000)]),fill=G,outline=OL,width=W)
    d.polygon(P([(300,700),(420,640),(450,1000),(330,1000)]),fill=BEL)
    # head
    d.ellipse(E([170,250,640,680]),fill=G,outline=OL,width=W)
    # snout
    d.rounded_rectangle(E([440,410,880,640]),radius=110*s,fill=G,outline=OL,width=W)
    d.rectangle(E([440,425,520,625]),fill=G)
    # jaw / smile
    d.arc(E([520,470,850,620]),20,160,fill=OL,width=W)
    d.polygon(P([(640,598),(665,640),(690,603)]),fill=(255,255,255,255),outline=OL,width=int(8*s))
    d.polygon(P([(740,595),(762,635),(786,592)]),fill=(255,255,255,255),outline=OL,width=int(8*s))
    # nostrils
    d.ellipse(E([790,445,825,480]),fill=OL);d.ellipse(E([730,450,760,480]),fill=OL)
    # cheek
    d.ellipse(E([280,520,360,575]),fill=(255,120,110,200))
    # eye
    d.ellipse(E([330,320,500,500]),fill=(255,255,255,255),outline=OL,width=W)
    d.ellipse(E([395,360,485,470]),fill=(30,30,40,255))
    d.ellipse(E([420,375,455,410]),fill=(255,255,255,255))
    d.line(P([(320,315),(500,345)]),fill=OL,width=int(22*s))
    # flame puff
    for (bb,c) in [([860,300,990,430],(255,150,30,255)),([890,250,975,335],(255,210,60,255)),([905,340,965,400],(255,240,150,255))]:
        d.ellipse(E(bb),fill=c)
    return L
def icon(n,pad=0.0):
    S=1024
    bg=grad(S,S,(255,170,60),(120,30,60)).convert('RGBA')
    m=int(S*pad);dr=dragon(S-2*m)
    bg.alpha_composite(dr,(m,m))
    return bg.convert('RGB').resize((n,n),Image.LANCZOS)
icon(180,0.06).save(f'{D}/apple-touch-icon.png')
icon(192,0.06).save(f'{D}/icon-192.png')
icon(512,0.06).save(f'{D}/icon-512.png')
icon(512,0.16).save(f'{D}/icon-maskable-512.png')
# Landscape iOS splash (game is landscape); generated at 2x then downscaled
def splash(w,h,name):
    W,H=w,h
    bg=grad(W,H,(40,16,30),(140,40,40)).convert('RGBA')
    sz=int(min(W,H)*0.55);dr=dragon(sz)
    bg.alpha_composite(dr,((W-sz)//2,int(H*0.08)))
    d=ImageDraw.Draw(bg)
    try:f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',int(H*0.09))
    except: f=ImageFont.load_default()
    t='Dragon Rampage';tw=d.textlength(t,font=f)
    y=int(H*0.08)+sz+int(H*0.03)
    d.text(((W-tw)/2+4,y+4),t,font=f,fill=(0,0,0,160))
    d.text(((W-tw)/2,y),t,font=f,fill=(255,214,120,255))
    bg.convert('RGB').save(f'{D}/{name}')
splash(2532,1170,'splash-2532x1170.png')
splash(1170,2532,'splash-1170x2532.png')
