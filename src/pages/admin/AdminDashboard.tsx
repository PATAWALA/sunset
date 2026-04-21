import { Calendar, Users, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Réservations du jour', value: '12', icon: Users, color: 'text-blue-400' },
          { title: 'Événements actifs', value: '8', icon: Calendar, color: 'text-sunset-400' },
          { title: 'Taux de remplissage', value: '85%', icon: TrendingUp, color: 'text-green-400' },
          { title: 'Prochain événement', value: '2h', icon: Clock, color: 'text-purple-400' },
        ].map((stat, i) => (
          <Card key={i} className="glass-effect border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <stat.icon className={`${stat.color}`} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard