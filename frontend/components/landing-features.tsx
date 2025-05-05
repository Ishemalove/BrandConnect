import { Briefcase, Users, BarChart, MessageSquare, Search, Filter, UserPlus, Clock } from "lucide-react"

export function LandingFeatures() {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Create Campaigns",
      description: "Brands can easily create and manage marketing campaigns to attract the right creators.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Connect with Talent",
      description: "Find and connect with creators who match your brand's vision and values.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Track Performance",
      description: "Monitor campaign metrics including views, engagement, and applications.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Direct Messaging",
      description: "Communicate directly with brands or creators through our integrated messaging system.",
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Discover Opportunities",
      description: "Creators can browse and discover campaigns that match their interests and skills.",
    },
    {
      icon: <Filter className="h-8 w-8 text-primary" />,
      title: "Personalized Feed",
      description: "Get campaign recommendations based on your interests and previous interactions.",
    },
    {
      icon: <UserPlus className="h-8 w-8 text-primary" />,
      title: "Detailed Profiles",
      description: "Create comprehensive profiles showcasing your work, skills, and availability.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Campaign Timelines",
      description: "Set and view campaign durations with clear deadlines and milestones.",
    },
  ]

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides powerful tools for both brands and creators to collaborate effectively.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
