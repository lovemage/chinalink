# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "rembg[cpu]",
#     "Pillow",
# ]
# ///
import os
import glob
import io
from rembg import remove
from PIL import Image

def process_images(input_dir):
    images = glob.glob(os.path.join(input_dir, "*.png"))
    for img_path in images:
        name, _ = os.path.splitext(img_path)
        out_path = f"{name}.webp"
        print(f"Processing {img_path} -> {out_path}")
        
        with open(img_path, "rb") as i:
            input_data = i.read()
            output_data = remove(input_data)
            
        img = Image.open(io.BytesIO(output_data))
        img.save(out_path, "WEBP", quality=95)
        print(f"Saved {out_path}")

if __name__ == "__main__":
    process_images("public/icons")