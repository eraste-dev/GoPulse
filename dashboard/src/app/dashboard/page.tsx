import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import ResponseTimeChart from './components/ResponseTimeChart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch data
  const reports = await prisma.pingReport.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50,
    include: { monitor: true }
  });

  if (reports.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Aucune donnée disponible</h2>
        <p>L'agent de monitoring n'a pas encore envoyé de rapports.</p>
      </div>
    );
  }

  const latest = reports[0];
  const isUp = latest.status === 'UP';

  // Calculate stats
  const total = reports.length;
  const successCount = reports.filter((r) => r.status === 'UP').length;
  const uptime = ((successCount / total) * 100).toFixed(1);
  const avgResponse = (reports.reduce((acc, curr) => acc + curr.responseTime, 0) / total).toFixed(0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
        <Badge variant={isUp ? 'default' : 'destructive'} className="text-lg px-4 py-1">
          {latest.monitor.name} ({latest.monitor.url})
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut Actuel</CardTitle>
            {isUp ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
              {latest.status}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernier check: {new Date(latest.timestamp).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime (Derniers 50)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uptime}%</div>
            <p className="text-xs text-muted-foreground">
              Taux de disponibilité
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponse} ms</div>
            <p className="text-xs text-muted-foreground">
              Sur les 50 dernières requêtes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Temps de réponse (ms)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponseTimeChart data={reports.slice().reverse()} />
        </CardContent>
      </Card>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Statut</TableHead>
                <TableHead>Moniteur</TableHead>
                <TableHead>Région</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Temps (ms)</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant={report.status === 'UP' ? 'outline' : 'destructive'} className={report.status === 'UP' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.monitor.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{report.region}</Badge>
                  </TableCell>
                  <TableCell>{report.statusCode}</TableCell>
                  <TableCell>{report.responseTime.toFixed(0)}</TableCell>
                  <TableCell className="text-right">
                    {new Date(report.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
