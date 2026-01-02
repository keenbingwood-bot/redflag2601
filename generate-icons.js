/**
 * 生成RedFlag.buzz图标文件的简单脚本
 * 使用Canvas API生成PNG图标
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 确保app目录存在
const appDir = path.join(__dirname, 'app');
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

// 定义要生成的尺寸
const sizes = [
  { width: 16, height: 16, filename: 'favicon-16x16.png' },
  { width: 24, height: 24, filename: 'favicon-24x24.png' }, // 专门用于页面标题
  { width: 32, height: 32, filename: 'favicon-32x32.png' },
  { width: 96, height: 96, filename: 'favicon-96x96.png' },
  { width: 180, height: 180, filename: 'favicon-180x180.png' },
  { width: 192, height: 192, filename: 'favicon-192x192.png' },
  { width: 512, height: 512, filename: 'favicon-512x512.png' },
  { width: 180, height: 180, filename: 'apple-touch-icon.png' }, // Apple Touch Icon
];

// 颜色定义 - 更新为黑底红三角设计
const colors = {
  black: '#000000',    // 黑色背景
  red: '#dc2626',      // 红色三角旗
  darkGray: '#333333', // 深灰色旗杆
  white: '#ffffff',    // 白色（用于装饰线）
};

console.log('🚩 开始生成RedFlag.buzz图标文件...');

// 为每个尺寸生成图标
sizes.forEach(({ width, height, filename }) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 透明背景
  ctx.clearRect(0, 0, width, height);

  // 计算缩放比例（基于64x64的设计）
  const scale = Math.min(width, height) / 64;

  // 绘制黑色圆形背景
  const circleRadius = 28 * scale;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.fillStyle = colors.black;
  ctx.fill();

  // 绘制红色三角旗
  const flagLeft = 20 * scale;
  const flagTop = 22 * scale;
  const flagRight = 44 * scale;
  const flagMiddle = 32 * scale;
  const flagBottom = 42 * scale;

  ctx.beginPath();
  ctx.moveTo(flagLeft, flagTop);
  ctx.lineTo(flagRight, flagMiddle);
  ctx.lineTo(flagLeft, flagBottom);
  ctx.closePath();
  ctx.fillStyle = colors.red;
  ctx.fill();

  // 绘制旗杆
  const poleWidth = Math.max(1, 3 * scale);
  const poleHeight = 20 * scale;
  const poleX = 18 * scale;
  const poleY = 22 * scale;

  ctx.fillStyle = colors.darkGray;
  ctx.fillRect(poleX, poleY, poleWidth, poleHeight);

  // 保存为PNG文件
  const filePath = path.join(appDir, filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);

  console.log(`✅ 已生成 ${filename} (${width}x${height})`);
});

// 复制一个作为favicon.ico（简单起见，使用32x32作为.ico）
// 注意：真正的.ico文件应该是多尺寸的，这里简化处理
const icoSource = path.join(appDir, 'favicon-32x32.png');
const icoDest = path.join(appDir, 'favicon.ico');
if (fs.existsSync(icoSource)) {
  fs.copyFileSync(icoSource, icoDest);
  console.log('✅ 已生成 favicon.ico（从32x32.png复制）');
}

console.log('\n🎉 所有图标文件已生成完成！');
console.log('📁 生成的文件位于 app/ 目录:');
console.log('  - favicon.ico (浏览器标签页图标)');
console.log('  - favicon-16x16.png (小尺寸图标)');
console.log('  - favicon-32x32.png (标准尺寸)');
console.log('  - favicon-96x96.png (中等尺寸)');
console.log('  - favicon-180x180.png (Apple尺寸)');
console.log('  - favicon-192x192.png (Android Chrome)');
console.log('  - favicon-512x512.png (大尺寸)');
console.log('  - apple-touch-icon.png (Apple Touch Icon)');
console.log('\n📝 图标设计: 黑色背景上的红色三角旗');
console.log('🎨 颜色:');
console.log(`   - 背景黑色: ${colors.black}`);
console.log(`   - 红色三角旗: ${colors.red}`);
console.log(`   - 旗杆深灰: ${colors.darkGray}`);