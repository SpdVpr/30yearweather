import { NextResponse } from 'next/server';

export async function GET() {
    const spec = {
        "openapi": "3.1.0",
        "info": {
            "title": "30YearWeather Intelligence API",
            "description": "API providing historical weather intelligence, scores, and travel suitability based on 30 years of data. Designed for AI Agents and Travel Planners.",
            "version": "1.0.0"
        },
        "servers": [
            {
                "url": "https://30yearweather.com"
            }
        ],
        "paths": {
            "/api/v1/search": {
                "get": {
                    "operationId": "searchCities",
                    "summary": "Search cities by weather criteria",
                    "description": "Finds cities that match specific weather requirements for a given month.",
                    "parameters": [
                        {
                            "name": "month",
                            "in": "query",
                            "required": true,
                            "schema": { "type": "integer", "minimum": 1, "maximum": 12 },
                            "description": "Month of travel (1-12)"
                        },
                        {
                            "name": "min_temp",
                            "in": "query",
                            "schema": { "type": "number" },
                            "description": "Minimum average daily temperature (Celsius)"
                        },
                        {
                            "name": "max_rain_prob",
                            "in": "query",
                            "schema": { "type": "number" },
                            "description": "Maximum allowed rain probability (0-100%)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "List of matching cities",
                            "content": { "application/json": {} }
                        }
                    }
                }
            },
            "/api/v1/city/{slug}": {
                "get": {
                    "operationId": "getCityDetails",
                    "summary": "Get detailed city intelligence",
                    "description": "Returns aggregated monthly climate data, safety profiles, and trends for a specific city.",
                    "parameters": [
                        {
                            "name": "slug",
                            "in": "path",
                            "required": true,
                            "schema": { "type": "string" },
                            "description": "City slug (e.g., prague-cz, tokyo-jp)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "City intelligence data",
                            "content": { "application/json": {} }
                        }
                    }
                }
            }
        }
    };

    return NextResponse.json(spec);
}
