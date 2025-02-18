import { createClient } from '@tutur3u/supabase/next/server';
import { Button } from '@tutur3u/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@tutur3u/ui/card';
import { ArrowRight, BookOpen, Code, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    wsId: string;
  }>;
}
export default async function HomePage({ params }: Props) {
  const database = await createClient();
  const {
    data: { user },
  } = await database.auth.getUser();

  if (!user?.id) {
    redirect('/login');
  }
  const { wsId } = await params;
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to the Prompt Engineering Playground
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Master the art of crafting effective prompts for AI models
        </p>
      </div>
      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-blue-100">
              Explore comprehensive guides and tutorials on prompt engineering
              techniques.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-green-100">
              Tackle real-world challenges and improve your skills in a hands-on
              environment.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Innovate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-yellow-100">
              Push the boundaries of what's possible with AI and create
              groundbreaking prompts.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Compete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-red-100">
              Join the leaderboard and see how your prompt engineering skills
              stack up against others.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href={`/${wsId}/challenges`}>
          <Button size="lg" className="gap-2">
            Start a Challenge <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/${wsId}/learn`}>
          <Button size="lg" variant="outline" className="gap-2">
            Explore Tutorials <BookOpen className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/${wsId}/leaderboard`}>
          <Button size="lg" variant="secondary" className="gap-2">
            View Leaderboard <Trophy className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
