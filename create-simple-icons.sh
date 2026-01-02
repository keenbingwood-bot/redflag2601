#!/bin/bash
# 创建简单的图标文件（临时解决方案）

echo "🚩 创建RedFlag.buzz简单图标文件..."

# 复制SVG作为主要favicon
cp app/favicon-simple.svg app/favicon.svg
echo "✅ 复制 favicon.svg"

# 创建简单的PNG文件（使用convert命令，如果可用）
if command -v convert &> /dev/null; then
    # 使用ImageMagick转换SVG到PNG
    convert -background none -resize 32x32 app/favicon-simple.svg app/favicon-32x32.png
    convert -background none -resize 16x16 app/favicon-simple.svg app/favicon-16x16.png
    convert -background none -resize 180x180 app/favicon-simple.svg app/favicon-180x180.png
    convert -background none -resize 192x192 app/favicon-simple.svg app/favicon-192x192.png
    convert -background none -resize 512x512 app/favicon-simple.svg app/favicon-512x512.png
    cp app/favicon-180x180.png app/apple-touch-icon.png

    # 创建ICO文件（使用32x32）
    convert app/favicon-32x32.png app/favicon.ico

    echo "✅ 使用ImageMagick生成PNG和ICO文件"
else
    echo "⚠️  ImageMagick未安装，只复制了SVG文件"
    echo "📝 请手动将SVG转换为PNG/ICO，或运行 generate-icons.js"
fi

echo ""
echo "📁 生成的文件:"
ls -la app/favicon* app/apple-touch-icon.png 2>/dev/null || echo "（部分文件可能未生成）"
echo ""
echo "🎨 图标设计: 黑色背景上的红色三角旗"
echo "⚫ 背景: #000000 (黑色)"
echo "🔴 三角旗: #dc2626 (红色)"
echo "🔘 旗杆: #333333 (深灰色)"