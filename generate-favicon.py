#!/usr/bin/env python3
"""
生成多尺寸favicon的脚本
需要安装: pip install Pillow
"""

from PIL import Image, ImageDraw
import os

def create_favicon_icon():
    """创建favicon.ico文件，包含多个尺寸"""

    # 定义要生成的尺寸
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]

    # 创建图像列表
    images = []

    for size in sizes:
        # 创建新图像
        img = Image.new('RGBA', size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        width, height = size

        # 计算缩放比例
        scale = min(width, height) / 64.0

        # 绘制黑色圆形背景
        circle_radius = int(28 * scale)
        circle_center = (width // 2, height // 2)
        draw.ellipse(
            [circle_center[0] - circle_radius, circle_center[1] - circle_radius,
             circle_center[0] + circle_radius, circle_center[1] + circle_radius],
            fill=(0, 0, 0)  # #000000 黑色
        )

        # 绘制红色三角旗
        # 计算三角旗的坐标（基于64x64画布的比例）
        flag_points = [
            (int(20 * scale), int(22 * scale)),  # 左上角
            (int(44 * scale), int(32 * scale)),  # 右上角/顶点
            (int(20 * scale), int(42 * scale))   # 左下角
        ]
        draw.polygon(flag_points, fill=(220, 38, 38))  # #dc2626 红色

        # 绘制旗杆
        pole_width = max(1, int(3 * scale))
        pole_left = int(18 * scale)
        pole_top = int(22 * scale)
        pole_height = int(20 * scale)
        draw.rectangle(
            [pole_left, pole_top,
             pole_left + pole_width, pole_top + pole_height],
            fill=(51, 51, 51)  # #333333 深灰色
        )

        images.append(img)

    # 保存为ICO文件（包含多个尺寸）
    images[0].save(
        'app/favicon.ico',
        format='ICO',
        sizes=[(img.width, img.height) for img in images],
        append_images=images[1:] if len(images) > 1 else []
    )

    print(f"✅ 已生成 favicon.ico，包含尺寸: {', '.join([f'{w}x{h}' for w, h in sizes])}")

def create_png_favicons():
    """创建PNG格式的favicon（用于现代浏览器）"""

    sizes = [(16, 16), (32, 32), (96, 96), (180, 180), (192, 192), (512, 512)]

    for width, height in sizes:
        # 创建新图像
        img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # 计算缩放比例
        scale = min(width, height) / 64.0

        # 绘制黑色圆形背景
        circle_radius = int(28 * scale)
        circle_center = (width // 2, height // 2)
        draw.ellipse(
            [circle_center[0] - circle_radius, circle_center[1] - circle_radius,
             circle_center[0] + circle_radius, circle_center[1] + circle_radius],
            fill=(0, 0, 0)  # #000000 黑色
        )

        # 绘制红色三角旗
        flag_points = [
            (int(20 * scale), int(22 * scale)),
            (int(44 * scale), int(32 * scale)),
            (int(20 * scale), int(42 * scale))
        ]
        draw.polygon(flag_points, fill=(220, 38, 38))  # #dc2626 红色

        # 绘制旗杆
        pole_width = max(1, int(3 * scale))
        pole_left = int(18 * scale)
        pole_top = int(22 * scale)
        pole_height = int(20 * scale)
        draw.rectangle(
            [pole_left, pole_top,
             pole_left + pole_width, pole_top + pole_height],
            fill=(51, 51, 51)  # #333333 深灰色
        )

        # 保存PNG文件
        filename = f'app/favicon-{width}x{height}.png'
        img.save(filename, 'PNG')
        print(f"✅ 已生成 {filename}")

if __name__ == '__main__':
    print("🚩 开始生成RedFlag.buzz favicon图标...")

    # 确保app目录存在
    os.makedirs('app', exist_ok=True)

    # 生成ICO文件
    create_favicon_icon()

    # 生成PNG文件
    create_png_favicons()

    print("\n🎉 所有favicon文件已生成完成！")
    print("📁 生成的文件:")
    print("  - app/favicon.ico (多尺寸ICO)")
    print("  - app/favicon-16x16.png")
    print("  - app/favicon-32x32.png")
    print("  - app/favicon-96x96.png")
    print("  - app/favicon-180x180.png (Apple Touch Icon)")
    print("  - app/favicon-192x192.png (Android Chrome)")
    print("  - app/favicon-512x512.png")
    print("\n📝 接下来需要更新app/layout.tsx中的metadata配置。")