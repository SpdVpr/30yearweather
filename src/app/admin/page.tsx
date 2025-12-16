import { Card, Title, Text, Metric, BarChart, List, ListItem, Grid, Badge } from "@tremor/react";
import { getApiLogs, ApiLog } from "@/lib/server-analytics";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const logs = await getApiLogs();

    // 1. Basic Stats
    const totalRequests = logs.length;
    const uniqueIPs = new Set(logs.map(l => l.ip)).size;

    // 2. Compute Requests Over Time (by Hour)
    const timelineData: Record<string, number> = {};
    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const key = `${date.getHours().toString().padStart(2, '0')}:00`;
        timelineData[key] = (timelineData[key] || 0) + 1;
    });

    const chartData = Object.entries(timelineData)
        .sort()
        .map(([hour, count]) => ({ Time: hour, Requests: count }));

    // 3. Top Endpoints
    const endpointCounts: Record<string, number> = {};
    logs.forEach(log => {
        endpointCounts[log.endpoint] = (endpointCounts[log.endpoint] || 0) + 1;
    });

    const topEndpoints = Object.entries(endpointCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // 4. Recent Logs
    const recentLogs = logs.slice(0, 10);

    return (
        <main className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen">
            <div className="mb-8">
                <Title className="text-2xl text-slate-900">API Intelligence Dashboard</Title>
                <Text className="text-slate-500">Real-time monitoring of B2B API usage.</Text>
            </div>

            <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mb-8">
                <Card decoration="top" decorationColor="blue">
                    <Text>Total API Requests</Text>
                    <Metric>{totalRequests}</Metric>
                </Card>
                <Card decoration="top" decorationColor="indigo">
                    <Text>Unique Consumers (IPs)</Text>
                    <Metric>{uniqueIPs}</Metric>
                </Card>
                <Card decoration="top" decorationColor="emerald">
                    <Text>System Status</Text>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-emerald-700 font-medium">Operational</span>
                    </div>
                </Card>
            </Grid>

            <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                <Card>
                    <Title>Traffic Volume (Today)</Title>
                    <BarChart
                        className="mt-6 h-72"
                        data={chartData}
                        index="Time"
                        categories={["Requests"]}
                        colors={["blue"]}
                        yAxisWidth={48}
                    />
                </Card>
                <Card>
                    <Title>Top Endpoints</Title>
                    <List className="mt-4">
                        {topEndpoints.map(([path, count]) => (
                            <ListItem key={path}>
                                <span className="font-mono text-sm">{path}</span>
                                <Badge size="xs" color="slate">{count} calls</Badge>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </Grid>

            <Card>
                <Title>Recent Live Logs</Title>
                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-3 font-medium text-slate-900">Time</th>
                                <th className="p-3 font-medium text-slate-900">Method</th>
                                <th className="p-3 font-medium text-slate-900">Endpoint</th>
                                <th className="p-3 font-medium text-slate-900">IP</th>
                                <th className="p-3 font-medium text-slate-900">Params</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentLogs.map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-3 whitespace-nowrap text-xs text-slate-400 font-mono">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="p-3">
                                        <Badge size="xs" color="blue">GET</Badge>
                                    </td>
                                    <td className="p-3 font-mono text-xs font-medium text-slate-700">{log.endpoint}</td>
                                    <td className="p-3 text-xs font-mono text-slate-500">{log.ip}</td>
                                    <td className="p-3 text-xs font-mono text-slate-400 truncate max-w-xs">
                                        {JSON.stringify(log.params)}
                                    </td>
                                </tr>
                            ))}
                            {recentLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        No API requests recorded yet. Try calling /api/v1/search
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </main>
    );
}
