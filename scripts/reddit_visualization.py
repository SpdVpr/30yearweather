"""
Reddit r/dataisbeautiful Visualization Generator

Creates stunning, publication-quality climate change visualizations
from 30 years of weather data across 223+ cities worldwide.

Data Source: Open-Meteo Historical Weather API (ERA5 Reanalysis)
"""

import json
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import LinearSegmentedColormap
from pathlib import Path
from datetime import datetime

# Setup paths
PROJECT_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = PROJECT_ROOT / "output" / "reddit-charts"
RESEARCH_DATA = PROJECT_ROOT / "src" / "lib" / "research" / "global-warming-2026.json"

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def load_warming_data():
    """Load the global warming research data."""
    with open(RESEARCH_DATA, "r", encoding="utf-8") as f:
        return json.load(f)

def create_marrakech_warming_chart():
    """
    Creates a stunning visualization of Marrakech's extreme warming trend.
    This is the most shocking story - fastest warming city in the dataset.
    """
    data = load_warming_data()
    
    # Find Marrakech data (fastest warming city)
    marrakech = None
    for city in data["top_warming_cities"]:
        if city["slug"] == "marrakech":
            marrakech = city
            break
    
    if not marrakech:
        print("Marrakech data not found!")
        return
    
    yearly_data = marrakech["yearly_data"]
    years = sorted([int(y) for y in yearly_data.keys()])
    temps = [yearly_data[str(y)] for y in years]
    
    # Create figure with dark theme (popular on Reddit)
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(16, 10), dpi=150)
    
    # Background gradient
    fig.patch.set_facecolor('#0d1117')
    ax.set_facecolor('#0d1117')
    
    # Create a dramatic gradient for the line
    # Color transitions from cool blue (past) to hot orange/red (present)
    n_points = len(years)
    colors = plt.cm.coolwarm(np.linspace(0.2, 0.95, n_points))
    
    # Create filled area under the curve with gradient
    for i in range(len(years) - 1):
        ax.fill_between(
            [years[i], years[i+1]], 
            [temps[i], temps[i+1]], 
            [min(temps) - 0.5] * 2,
            color=colors[i],
            alpha=0.3
        )
        ax.plot(
            [years[i], years[i+1]], 
            [temps[i], temps[i+1]], 
            color=colors[i],
            linewidth=3,
            solid_capstyle='round'
        )
    
    # Add scatter points with glow effect
    for i, (year, temp) in enumerate(zip(years, temps)):
        # Outer glow
        ax.scatter(year, temp, s=150, color=colors[i], alpha=0.3, zorder=5)
        # Inner point
        ax.scatter(year, temp, s=50, color=colors[i], edgecolors='white', linewidth=0.5, zorder=10)
    
    # Add trend line
    z = np.polyfit(years, temps, 1)
    p = np.poly1d(z)
    trend_years = np.linspace(min(years), max(years), 100)
    ax.plot(trend_years, p(trend_years), '--', color='#ff6b6b', linewidth=2, alpha=0.8, label='Linear Trend')
    
    # Highlight extreme years
    max_temp_idx = temps.index(max(temps))
    min_temp_idx = temps.index(min(temps))
    
    ax.annotate(
        f'{max(temps):.1f}°C\n({years[max_temp_idx]})',
        xy=(years[max_temp_idx], max(temps)),
        xytext=(years[max_temp_idx] + 1, max(temps) + 0.5),
        fontsize=12,
        color='#ff4757',
        fontweight='bold',
        arrowprops=dict(arrowstyle='->', color='#ff4757', lw=1.5)
    )
    
    ax.annotate(
        f'{min(temps):.1f}°C\n({years[min_temp_idx]})',
        xy=(years[min_temp_idx], min(temps)),
        xytext=(years[min_temp_idx] - 3, min(temps) - 0.8),
        fontsize=12,
        color='#70a1ff',
        fontweight='bold',
        arrowprops=dict(arrowstyle='->', color='#70a1ff', lw=1.5)
    )
    
    # Title and labels with dramatic styling
    title_text = ax.set_title(
        "MARRAKECH: The World's Fastest Warming City\n" +
        f"+{marrakech['warming_rate_decade']:.2f}°C per decade  •  +{marrakech['warming_total']:.1f}°C total since 1996",
        fontsize=24,
        fontweight='bold',
        color='#ff6b6b',
        pad=20,
        linespacing=1.8
    )
    
    ax.set_xlabel('Year', fontsize=14, color='#8b949e', labelpad=10)
    ax.set_ylabel('Average Annual Temperature (°C)', fontsize=14, color='#8b949e', labelpad=10)
    
    # Grid styling
    ax.grid(True, linestyle='--', alpha=0.2, color='#30363d')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#30363d')
    ax.spines['bottom'].set_color('#30363d')
    
    # Tick styling
    ax.tick_params(colors='#8b949e', labelsize=12)
    
    # Y-axis range
    ax.set_ylim(min(temps) - 1, max(temps) + 1.5)
    ax.set_xlim(min(years) - 1, max(years) + 1)
    
    # Add data source and methodology
    fig.text(
        0.99, 0.01,
        'Data: Open-Meteo ERA5 Reanalysis (1996-2025)  •  Analysis: 30yearweather.com',
        fontsize=10,
        color='#6e7681',
        ha='right',
        va='bottom',
        style='italic'
    )
    
    # Add comparison context box
    textstr = f'''Global Average: +0.40°C/decade
Europe: +0.52°C/decade
Africa: +0.56°C/decade
Marrakech: +1.45°C/decade (3.6x global)'''
    
    props = dict(boxstyle='round,pad=0.5', facecolor='#161b22', edgecolor='#30363d', alpha=0.9)
    ax.text(0.02, 0.98, textstr, transform=ax.transAxes, fontsize=11,
            verticalalignment='top', bbox=props, color='#c9d1d9', family='monospace')
    
    plt.tight_layout()
    
    # Save in multiple formats
    output_path = OUTPUT_DIR / "marrakech_warming_trend.png"
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='#0d1117', edgecolor='none')
    print(f"✅ Saved: {output_path}")
    
    # Also save high-res version
    output_path_hires = OUTPUT_DIR / "marrakech_warming_trend_hires.png"
    plt.savefig(output_path_hires, dpi=300, bbox_inches='tight', facecolor='#0d1117', edgecolor='none')
    print(f"✅ Saved high-res: {output_path_hires}")
    
    plt.close()
    return output_path


def create_top_warming_cities_chart():
    """
    Creates a horizontal bar chart showing top 15 fastest warming cities.
    Very popular format on r/dataisbeautiful.
    """
    data = load_warming_data()
    
    # Get top 15 cities
    cities = data["top_warming_cities"][:15]
    
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(14, 12), dpi=150)
    fig.patch.set_facecolor('#0d1117')
    ax.set_facecolor('#0d1117')
    
    # Prepare data
    names = [f"{c['name']}, {c['country']}" for c in reversed(cities)]
    rates = [c['warming_rate_decade'] for c in reversed(cities)]
    continents = [c['continent'] for c in reversed(cities)]
    
    # Color by continent
    continent_colors = {
        'Africa': '#ff6b6b',
        'Asia': '#ffa502',
        'Europe': '#70a1ff',
        'Americas': '#7bed9f',
        'Oceania': '#a55eea',
        'Pacific': '#a55eea'
    }
    colors = [continent_colors.get(c, '#ffffff') for c in continents]
    
    # Create bars with gradient effect
    bars = ax.barh(names, rates, color=colors, height=0.7, edgecolor='white', linewidth=0.5)
    
    # Add value labels
    for bar, rate in zip(bars, rates):
        width = bar.get_width()
        ax.text(width + 0.02, bar.get_y() + bar.get_height()/2, 
                f'+{rate:.2f}°C', va='center', ha='left', 
                fontsize=11, color='#c9d1d9', fontweight='bold')
    
    # Add global average line
    global_avg = data['meta']['global_warming_rate_decade']
    ax.axvline(x=global_avg, color='#ff4757', linestyle='--', linewidth=2, alpha=0.8)
    ax.text(global_avg + 0.02, len(names) - 0.5, f'Global Avg\n+{global_avg:.2f}°C/decade', 
            fontsize=10, color='#ff4757', fontweight='bold')
    
    # Title with subtitle
    ax.set_title(
        "TOP 15 FASTEST WARMING CITIES IN THE WORLD\n" +
        "Warming rate per decade based on 30 years of data (1995-2025)",
        fontsize=22,
        fontweight='bold',
        color='white',
        pad=20,
        linespacing=1.6
    )
    
    # X-axis label - positioned to the left to avoid data source overlap
    ax.set_xlabel('Warming Rate (°C per decade)', fontsize=13, color='#8b949e', labelpad=10, loc='left')
    
    # Styling
    ax.grid(True, axis='x', linestyle='--', alpha=0.2, color='#30363d')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#30363d')
    ax.spines['bottom'].set_color('#30363d')
    ax.tick_params(colors='#8b949e', labelsize=11)
    
    # Legend
    legend_patches = [mpatches.Patch(color=color, label=continent) 
                      for continent, color in continent_colors.items() 
                      if continent in continents]
    ax.legend(handles=legend_patches, loc='lower right', fontsize=10, 
              facecolor='#161b22', edgecolor='#30363d', labelcolor='#c9d1d9')
    
    # Data source - positioned to avoid xlabel
    fig.text(0.99, 0.01,
             'Data: Open-Meteo ERA5 Reanalysis  •  30yearweather.com',
             fontsize=10, color='#6e7681', ha='right', va='bottom', style='italic')
    
    plt.tight_layout()
    
    output_path = OUTPUT_DIR / "top_warming_cities.png"
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='#0d1117', edgecolor='none')
    print(f"✅ Saved: {output_path}")
    
    plt.close()
    return output_path


def create_continent_comparison_chart():
    """
    Creates a stunning continent comparison visualization.
    """
    data = load_warming_data()
    
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(14, 8), dpi=150)
    fig.patch.set_facecolor('#0d1117')
    ax.set_facecolor('#0d1117')
    
    # Prepare data
    continents = list(data['continent_stats'].keys())
    rates = [data['continent_stats'][c]['avg_warming_rate_decade'] for c in continents]
    cities_count = [data['continent_stats'][c]['cities_count'] for c in continents]
    fastest_cities = [data['continent_stats'][c]['fastest_city'] for c in continents]
    
    # Sort by warming rate
    sorted_data = sorted(zip(continents, rates, cities_count, fastest_cities), 
                         key=lambda x: x[1], reverse=True)
    continents, rates, cities_count, fastest_cities = zip(*sorted_data)
    
    # Colors - warm gradient
    colors = ['#ff6b6b', '#ffa502', '#70a1ff', '#7bed9f', '#a55eea']
    
    # Create bars
    bars = ax.bar(continents, rates, color=colors, width=0.6, 
                  edgecolor='white', linewidth=1)
    
    # Add value labels and city count
    for bar, rate, count, fastest in zip(bars, rates, cities_count, fastest_cities):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2, height + 0.02, 
                f'+{rate:.2f}°C', ha='center', va='bottom', 
                fontsize=14, color='white', fontweight='bold')
        ax.text(bar.get_x() + bar.get_width()/2, 0.02, 
                f'{count} cities\nFastest: {fastest}', ha='center', va='bottom', 
                fontsize=9, color='#0d1117', fontweight='bold')
    
    # Global average line
    global_avg = data['meta']['global_warming_rate_decade']
    ax.axhline(y=global_avg, color='#ff4757', linestyle='--', linewidth=2, alpha=0.8)
    ax.text(len(continents) - 0.5, global_avg + 0.02, 
            f'Global Avg: +{global_avg:.2f}°C/decade', 
            fontsize=11, color='#ff4757', fontweight='bold', ha='right')
    
    # Title with subtitle
    ax.set_title(
        "WHICH CONTINENT IS WARMING FASTEST?\n" +
        "Average warming rate per decade across 259 cities worldwide",
        fontsize=24,
        fontweight='bold',
        color='white',
        pad=20,
        linespacing=1.6
    )
    
    ax.set_ylabel('Warming Rate (°C per decade)', fontsize=13, color='#8b949e', labelpad=10)
    
    # Styling
    ax.grid(True, axis='y', linestyle='--', alpha=0.2, color='#30363d')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#30363d')
    ax.spines['bottom'].set_color('#30363d')
    ax.tick_params(colors='#8b949e', labelsize=12)
    ax.set_ylim(0, max(rates) + 0.15)
    
    # Data source
    fig.text(0.99, 0.01,
             'Data: Open-Meteo ERA5 Reanalysis (1995-2025)  •  Analysis: 30yearweather.com',
             fontsize=10, color='#6e7681', ha='right', va='bottom', style='italic')
    
    plt.tight_layout()
    
    output_path = OUTPUT_DIR / "continent_warming_comparison.png"
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='#0d1117', edgecolor='none')
    print(f"✅ Saved: {output_path}")
    
    plt.close()
    return output_path


def create_multiple_cities_trend_chart():
    """
    Creates a small multiples visualization showing temperature trends
    for multiple cities - very popular on dataisbeautiful.
    """
    data = load_warming_data()
    
    # Select diverse cities (fast warming, slow warming, different continents)
    selected_slugs = ['marrakech', 'yerevan', 'interlaken', 'tromso', 'prague', 'tokyo', 
                      'new-york', 'sydney', 'cairo', 'mexico-city', 'london', 'dubai']
    
    selected_cities = []
    for city in data["top_warming_cities"]:
        if city["slug"] in selected_slugs:
            selected_cities.append(city)
    
    # We need to also check cities that might not be in top_warming (like London)
    # For simplicity, we'll use what we have in top 25
    if len(selected_cities) < 12:
        for city in data["top_warming_cities"][:12]:
            if city not in selected_cities:
                selected_cities.append(city)
        selected_cities = selected_cities[:12]
    
    plt.style.use('dark_background')
    fig, axes = plt.subplots(3, 4, figsize=(20, 15), dpi=150)
    fig.patch.set_facecolor('#0d1117')
    
    for idx, city in enumerate(selected_cities):
        ax = axes[idx // 4, idx % 4]
        ax.set_facecolor('#0d1117')
        
        yearly_data = city["yearly_data"]
        years = sorted([int(y) for y in yearly_data.keys()])
        temps = [yearly_data[str(y)] for y in years]
        
        # Color based on warming rate
        if city['warming_rate_decade'] >= 1.0:
            line_color = '#ff4757'
        elif city['warming_rate_decade'] >= 0.5:
            line_color = '#ffa502'
        else:
            line_color = '#70a1ff'
        
        # Plot
        ax.fill_between(years, temps, min(temps) - 0.5, alpha=0.3, color=line_color)
        ax.plot(years, temps, color=line_color, linewidth=2)
        
        # Trend line
        z = np.polyfit(years, temps, 1)
        p = np.poly1d(z)
        ax.plot(years, p(years), '--', color='white', linewidth=1, alpha=0.5)
        
        # Title
        ax.set_title(f"{city['name']}, {city['country']}", 
                     fontsize=12, color='white', fontweight='bold', pad=5)
        ax.text(0.5, 0.92, f"+{city['warming_rate_decade']:.2f}°C/decade", 
                transform=ax.transAxes, fontsize=10, color=line_color, 
                ha='center', fontweight='bold')
        
        # Styling
        ax.grid(True, linestyle='--', alpha=0.1, color='#30363d')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#30363d')
        ax.spines['bottom'].set_color('#30363d')
        ax.tick_params(colors='#6e7681', labelsize=8)
        
        # Show only first and last year on x-axis
        ax.set_xticks([min(years), max(years)])
    
    # Main title with subtitle
    fig.suptitle(
        "30 YEARS OF WARMING: How 12 Cities Changed\n" +
        "Annual average temperatures from 1995-2025 based on ERA5 reanalysis data",
        fontsize=24,
        fontweight='bold',
        color='white',
        y=0.98,
        linespacing=1.6
    )
    
    # Data source
    fig.text(0.99, 0.01,
             'Data: Open-Meteo ERA5 Reanalysis  •  Analysis: 30yearweather.com',
             fontsize=10, color='#6e7681', ha='right', va='bottom', style='italic')
    
    # Legend
    legend_text = "● +1.0°C/decade+ (red)   ● +0.5-1.0°C/decade (orange)   ● <+0.5°C/decade (blue)"
    fig.text(0.5, 0.02, legend_text, fontsize=11, color='#c9d1d9', ha='center')
    
    plt.tight_layout(rect=[0, 0.03, 1, 0.93])
    
    output_path = OUTPUT_DIR / "multiple_cities_warming.png"
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='#0d1117', edgecolor='none')
    print(f"✅ Saved: {output_path}")
    
    plt.close()
    return output_path


def main():
    print("=" * 60)
    print("🌡️  Reddit r/dataisbeautiful Visualization Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print()
    
    print("📊 Generating visualizations...")
    print()
    
    # Generate all charts
    chart1 = create_marrakech_warming_chart()
    print()
    
    chart2 = create_top_warming_cities_chart()
    print()
    
    chart3 = create_continent_comparison_chart()
    print()
    
    chart4 = create_multiple_cities_trend_chart()
    print()
    
    print("=" * 60)
    print("✅ All visualizations generated successfully!")
    print()
    print("📁 Output files:")
    for f in OUTPUT_DIR.glob("*.png"):
        size_kb = f.stat().st_size / 1024
        print(f"   • {f.name} ({size_kb:.0f} KB)")
    print()
    print("🚀 Ready for Reddit posting!")
    print()
    print("Suggested r/dataisbeautiful title for Marrakech chart:")
    print("   \"Marrakech is warming at +1.45°C per decade — 3.6x the global")
    print("    average. Here's 30 years of temperature data. [OC]\"")
    print()


if __name__ == "__main__":
    main()
