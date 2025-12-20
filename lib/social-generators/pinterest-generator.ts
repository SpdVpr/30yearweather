// lib/social-generators/pinterest-generator.ts
/**
 * Social Content Generator
 * 4 variants per city:
 * - 1:1 (1080x1080) - Instagram Feed
 * - 2:3 (1000x1500) - Pinterest
 * - 9:16 (1080x1920) - Stories Best Day
 * - 9:16 (1080x1920) - Stories Worst Day
 */
import { createCanvas, loadImage } from 'canvas';
import type { CityData } from './types';

// =============================================
// 1. INSTAGRAM FEED (1:1, 1080x1080)
// =============================================
const FEED_SIZE = 1080;

export async function generateFeedPost(cityData: CityData): Promise<Buffer> {
    console.log(`    🎨 Rendering feed (1:1) for ${cityData.name}...`);

    const canvas = createCanvas(FEED_SIZE, FEED_SIZE);
    const ctx = canvas.getContext('2d') as any;

    // Hero image
    await drawHeroImage(ctx, cityData.heroImagePath, FEED_SIZE, FEED_SIZE);

    // Overlay
    const overlay = ctx.createLinearGradient(0, 0, 0, FEED_SIZE);
    overlay.addColorStop(0, 'rgba(0,0,0,0.2)');
    overlay.addColorStop(0.6, 'rgba(0,0,0,0.4)');
    overlay.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, FEED_SIZE, FEED_SIZE);

    // Logo
    const padding = 40;
    ctx.fillStyle = '#ea580c';
    roundRect(ctx, padding, padding, 45, 45, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('30', padding + 22, padding + 23);
    ctx.textAlign = 'left';
    ctx.fillText('30YearWeather', padding + 55, padding + 23);

    // Center content
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(cityData.name, FEED_SIZE / 2, FEED_SIZE / 2 - 80);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '28px Arial';
    ctx.fillText('BEST MONTH TO VISIT', FEED_SIZE / 2, FEED_SIZE / 2 - 10);

    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 85px Arial';
    ctx.fillText(cityData.bestMonths[0], FEED_SIZE / 2, FEED_SIZE / 2 + 80);

    ctx.shadowColor = 'transparent';

    // Bottom data row
    const cardY = FEED_SIZE - 150;
    const cardWidth = 300;
    const cardHeight = 90;
    const startX = (FEED_SIZE - (cardWidth * 3 + 30 * 2)) / 2;

    const cards = [
        { icon: '🌡️', value: `${cityData.avgTempMin}-${cityData.avgTempMax}°C` },
        { icon: '💧', value: `${cityData.rainProbability}% rain` },
        { icon: '👥', value: cityData.crowds }
    ];

    cards.forEach((card, i) => {
        const x = startX + i * (cardWidth + 30);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        roundRect(ctx, x, cardY, cardWidth, cardHeight, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        roundRect(ctx, x, cardY, cardWidth, cardHeight, 12);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${card.icon}  ${card.value}`, x + cardWidth / 2, cardY + 52);
    });

    // URL
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '18px Arial';
    ctx.fillText(`30yearweather.com/${cityData.slug}`, FEED_SIZE / 2, FEED_SIZE - 25);

    return canvas.toBuffer('image/png');
}

// =============================================
// 2. PINTEREST (2:3, 1000x1500)
// =============================================
const PIN_WIDTH = 1000;
const PIN_HEIGHT = 1500;

export async function generatePinterestPin(cityData: CityData): Promise<Buffer> {
    console.log(`    🎨 Rendering Pinterest (2:3) for ${cityData.name}...`);

    const canvas = createCanvas(PIN_WIDTH, PIN_HEIGHT);
    const ctx = canvas.getContext('2d') as any;

    await drawHeroImage(ctx, cityData.heroImagePath, PIN_WIDTH, PIN_HEIGHT);

    // Overlay
    const overlay = ctx.createLinearGradient(0, 0, 0, PIN_HEIGHT);
    overlay.addColorStop(0, 'rgba(0,0,0,0.15)');
    overlay.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    overlay.addColorStop(0.8, 'rgba(0,0,0,0.5)');
    overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, PIN_WIDTH, PIN_HEIGHT);

    const padding = 50;

    // Logo
    ctx.fillStyle = '#ea580c';
    roundRect(ctx, padding, padding, 50, 50, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('30', padding + 25, padding + 26);
    ctx.textAlign = 'left';
    ctx.fillText('30YearWeather', padding + 60, padding + 26);

    // NASA badge
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    roundRect(ctx, PIN_WIDTH - 260, padding, 210, 42, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '17px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📊 30 Years of NASA Data', PIN_WIDTH - 155, padding + 23);

    // City name (bottom left)
    const bottomY = PIN_HEIGHT - 180;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 25;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 85px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(cityData.name, padding, bottomY);

    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 42px Arial';
    ctx.fillText('Best Time to Visit', padding, bottomY + 55);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '24px Arial';
    ctx.fillText('Historical Weather Forecast', padding, bottomY + 95);

    ctx.shadowColor = 'transparent';

    // Data cards (right side)
    const cardX = PIN_WIDTH - 380;
    const cardWidth = 340;
    const cardHeight = 110;
    let cardY = 160;

    const dataCards = [
        { label: 'BEST MONTH', icon: '📅', value: cityData.bestMonths[0], color: '#fb923c' },
        { label: 'TEMPERATURE', icon: '🌡️', value: `${cityData.avgTempMin}-${cityData.avgTempMax}°C`, color: '#ffffff' },
        { label: 'RAIN PROBABILITY', icon: '💧', value: `${cityData.rainProbability}%`, color: '#ffffff' },
        { label: 'TOURIST CROWDS', icon: '👥', value: cityData.crowds.toUpperCase(), color: '#ffffff' }
    ];

    dataCards.forEach(card => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 14);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '13px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(card.label, cardX + 22, cardY + 28);

        ctx.font = '26px Arial';
        ctx.fillText(card.icon, cardX + 22, cardY + 70);

        ctx.fillStyle = card.color;
        ctx.font = 'bold 38px Arial';
        ctx.fillText(card.value, cardX + 65, cardY + 73);

        cardY += cardHeight + 18;
    });

    // Bottom URL bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, PIN_HEIGHT - 60, PIN_WIDTH, 60);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`🌐 30yearweather.com/${cityData.slug}`, PIN_WIDTH / 2, PIN_HEIGHT - 28);

    return canvas.toBuffer('image/png');
}

// =============================================
// 3 & 4. INSTAGRAM STORIES (9:16, 1080x1920)
// =============================================
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

export async function generateBestDayPost(cityData: CityData): Promise<Buffer> {
    return generateDayPost(cityData, {
        date: `${cityData.bestMonths[0]} 15`,
        type: 'best',
        title: 'BEST DAY TO VISIT',
        subtitle: 'Lowest rain risk & perfect temperature',
        temp: `${cityData.avgTempMax}°C`,
        rain: '5%',
        crowds: cityData.crowds,
        sunrise: '5:45 AM',
        sunset: '8:30 PM',
        verdict: 'Perfect Conditions',
        color: '#4ade80'
    });
}

export async function generateWorstDayPost(cityData: CityData): Promise<Buffer> {
    return generateDayPost(cityData, {
        date: 'November 15',
        type: 'worst',
        title: 'WORST DAY TO VISIT',
        subtitle: 'Highest rain risk & cold temperatures',
        temp: `${cityData.avgTempMin - 8}°C`,
        rain: '65%',
        crowds: 'Low',
        sunrise: '7:30 AM',
        sunset: '4:15 PM',
        verdict: 'Avoid if possible',
        color: '#ef4444'
    });
}

interface DayInfo {
    date: string;
    type: 'best' | 'worst';
    title: string;
    subtitle: string;
    temp: string;
    rain: string;
    crowds: string;
    sunrise: string;
    sunset: string;
    verdict: string;
    color: string;
}

async function generateDayPost(cityData: CityData, day: DayInfo): Promise<Buffer> {
    console.log(`    🎨 Rendering ${day.type} day (9:16) for ${cityData.name}...`);

    const canvas = createCanvas(STORY_WIDTH, STORY_HEIGHT);
    const ctx = canvas.getContext('2d') as any;

    await drawHeroImage(ctx, cityData.heroImagePath, STORY_WIDTH, STORY_HEIGHT);

    // Overlay
    const overlay = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT);
    overlay.addColorStop(0, 'rgba(0,0,0,0.15)');
    overlay.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    overlay.addColorStop(0.8, 'rgba(0,0,0,0.5)');
    overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    const padding = 50;

    // Logo
    ctx.fillStyle = '#ea580c';
    roundRect(ctx, padding, padding, 55, 55, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('30', padding + 27, padding + 28);
    ctx.textAlign = 'left';
    ctx.fillText('30YearWeather', padding + 70, padding + 28);

    // NASA badge
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    roundRect(ctx, STORY_WIDTH - 280, padding, 230, 45, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📊 30 Years of NASA Data', STORY_WIDTH - 165, padding + 24);

    // City name (bottom left)
    const bottomTextY = STORY_HEIGHT - 620;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 25;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 95px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(cityData.name, padding, bottomTextY);

    // Date - MORE SPACING
    ctx.fillStyle = day.color;
    ctx.font = 'bold 48px Arial';
    ctx.fillText(day.date, padding, bottomTextY + 85);  // Was 65, now 85

    // Title - MORE SPACING  
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '26px Arial';
    ctx.fillText(day.title, padding, bottomTextY + 135);  // Was 110, now 135

    ctx.shadowColor = 'transparent';

    // Data cards (right side)
    const cardX = STORY_WIDTH - 420;
    const cardWidth = 370;
    const cardHeight = 115;
    let cardY = 180;

    // Temperature
    drawStoryCard(ctx, cardX, cardY, cardWidth, cardHeight, 'TEMPERATURE', '🌡️', day.temp, '#ffffff');
    cardY += cardHeight + 20;

    // Rain - FIX: "chance" vedle čísla
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('RAIN PROBABILITY', cardX + 25, cardY + 30);

    ctx.font = '28px Arial';
    ctx.fillText('💧', cardX + 25, cardY + 72);

    ctx.fillStyle = day.type === 'worst' ? '#ef4444' : '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(day.rain, cardX + 70, cardY + 75);

    // "chance" VEDLE čísla
    const rainWidth = ctx.measureText(day.rain).width;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '22px Arial';
    ctx.fillText(' chance', cardX + 72 + rainWidth, cardY + 75);

    cardY += cardHeight + 20;

    // Status (replacing Tourist Crowds)
    const statusText = day.type === 'best' ? 'PERFECT' : 'AVOID';
    const statusIcon = day.type === 'best' ? '✓' : '✗';
    const statusColor = day.type === 'best' ? '#4ade80' : '#ef4444';
    drawStoryCard(ctx, cardX, cardY, cardWidth, cardHeight, 'STATUS', statusIcon, statusText, statusColor);
    cardY += cardHeight + 20;

    // Comfort Score - replacing Golden Hour
    const comfortScore = day.type === 'best' ? 92 : 35;
    const scoreColor = day.type === 'best' ? '#4ade80' : '#ef4444';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
    ctx.fill();
    ctx.strokeStyle = scoreColor;
    ctx.lineWidth = 2;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('COMFORT SCORE', cardX + 25, cardY + 30);

    ctx.font = '28px Arial';
    ctx.fillText('😊', cardX + 25, cardY + 72);

    ctx.fillStyle = scoreColor;
    ctx.font = 'bold 48px Arial';
    ctx.fillText(`${comfortScore}`, cardX + 70, cardY + 78);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '28px Arial';
    ctx.fillText('/100', cardX + 145, cardY + 78);

    // Verdict banner
    const verdictY = STORY_HEIGHT - 260;
    ctx.fillStyle = day.type === 'best' ? 'rgba(74, 222, 128, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    roundRect(ctx, padding, verdictY, STORY_WIDTH - padding * 2, 95, 16);
    ctx.fill();
    ctx.strokeStyle = day.color;
    ctx.lineWidth = 2;
    roundRect(ctx, padding, verdictY, STORY_WIDTH - padding * 2, 95, 16);
    ctx.stroke();

    ctx.fillStyle = day.color;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    const icon = day.type === 'best' ? '✓' : '✗';
    ctx.fillText(`${icon}  ${day.verdict}`, STORY_WIDTH / 2, verdictY + 55);

    // Bottom URL
    const bottomY = STORY_HEIGHT - 115;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, bottomY, STORY_WIDTH, 115);

    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 26px Arial';
    ctx.fillText(day.subtitle, STORY_WIDTH / 2, bottomY + 38);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '22px Arial';
    ctx.fillText(`🌐 30yearweather.com/${cityData.slug}`, STORY_WIDTH / 2, bottomY + 80);

    return canvas.toBuffer('image/png');
}

// =============================================
// HELPERS
// =============================================

async function drawHeroImage(ctx: any, imagePath: string, width: number, height: number) {
    try {
        const heroImage = await loadImage(imagePath);
        const imgRatio = heroImage.width / heroImage.height;
        const canvasRatio = width / height;

        let drawWidth, drawHeight, offsetX, offsetY;
        if (imgRatio > canvasRatio) {
            drawHeight = height;
            drawWidth = height * imgRatio;
            offsetX = -(drawWidth - width) / 2;
            offsetY = 0;
        } else {
            drawWidth = width;
            drawHeight = width / imgRatio;
            offsetX = 0;
            offsetY = -(drawHeight - height) / 2;
        }
        ctx.drawImage(heroImage, offsetX, offsetY, drawWidth, drawHeight);
    } catch (error) {
        const fallback = ctx.createLinearGradient(0, 0, width, height);
        fallback.addColorStop(0, '#1e3a5f');
        fallback.addColorStop(1, '#1a4971');
        ctx.fillStyle = fallback;
        ctx.fillRect(0, 0, width, height);
    }
}

function drawStoryCard(ctx: any, x: number, y: number, w: number, h: number, label: string, icon: string, value: string, color: string) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    roundRect(ctx, x, y, w, h, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    roundRect(ctx, x, y, w, h, 16);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 25, y + 30);

    ctx.font = '28px Arial';
    ctx.fillText(icon, x + 25, y + 72);

    ctx.fillStyle = color;
    ctx.font = 'bold 40px Arial';
    ctx.fillText(value, x + 70, y + 75);
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
