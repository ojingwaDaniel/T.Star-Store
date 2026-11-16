from PIL import Image

path = "public/logo/tstar-logo.png"
gray = Image.open(path).convert("L")

# Black artwork on white: darkness becomes opacity, white becomes transparent
alpha = gray.point(lambda p: 0 if p > 225 else 255 - p)

out = Image.new("RGBA", gray.size, (0, 0, 0, 255))
out.putalpha(alpha)

# Trim the empty margins
bbox = alpha.point(lambda p: 255 if p > 20 else 0).getbbox()
out = out.crop(bbox)

out.save(path)
print("Saved", out.size)