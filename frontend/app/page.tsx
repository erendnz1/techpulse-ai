"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FadeInSection } from "./fade-in-section";
import CountUp from "react-countup";
import {
  Newspaper,
  Bot,
  ChartColumn,
  BellRing,
} from "lucide-react";
import {
  FaGithub,
  FaDocker,
  FaAws,
  FaCloudflare,
} from "react-icons/fa6";

import { ShieldCheck } from "lucide-react";
import Image from "next/image";
export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <nav className="relative flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-8 dark:border-gray-800">

  <a
    href="/"
    className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    TechPulse <span className="text-blue-600">AI</span>
  </a>


  {/* Desktop Menu */}
  <div className="hidden items-center gap-10 text-base font-semibold text-gray-700 dark:text-gray-200 md:flex">

    <a
      href="#features"
      className="hover:text-blue-600"
    >
      Features
    </a>

    <a
      href="#categories"
      className="hover:text-blue-600"
    >
      Categories
    </a>

    <a
      href="#about"
      className="hover:text-blue-600"
    >
      About
    </a>

  </div>



  {/* Desktop Actions */}
  <div className="hidden items-center gap-4 md:flex">

    <ThemeToggle />

    <a
      href="/login"
      className="font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-200"
    >
      Sign In
    </a>


    <a
      href="/register"
      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
    >
      Get Started
    </a>

  </div>



  {/* Mobile Button */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="text-3xl text-gray-700 dark:text-white md:hidden"
  >
    ☰
  </button>



  {/* Mobile Menu */}
  {menuOpen && (

    <div className="
      absolute
      left-0
      top-[70px]
      z-50
      flex
      w-full
      flex-col
      gap-5
      border-b
      border-gray-200
      bg-white
      p-6
      shadow-lg
      dark:border-gray-800
      dark:bg-gray-900
      md:hidden
    ">


      <a href="#features">
        Features
      </a>

      <a href="#categories">
        Categories
      </a>

      <a href="#about">
        About
      </a>


      <a
        href="/login"
        className="text-blue-600"
      >
        Sign In
      </a>


      <a
        href="/register"
        className="rounded-lg bg-blue-600 px-4 py-2 text-center text-white"
      >
        Get Started
      </a>


      <div className="flex justify-start">
  <ThemeToggle />
</div>

    </div>

  )}

</nav>
     
      <FadeInSection>
        <section className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 sm:py-24 text-center sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl dark:block" />
          {/* Light mode - left edge glow */}
         <div className="pointer-events-none absolute -left-64 top-1/2 z-0 hidden sm:block h-96 w-96 -translate-y-1/2 rounded-full bg-blue-200/60 blur-3xl dark:hidden" />

          {/* Light mode - right edge glow */}
          <div className="pointer-events-none absolute -right-64 top-1/2 z-0  hidden sm:block h-96 w-96 -translate-y-1/2 rounded-full bg-blue-200/60 blur-3xl dark:hidden" />

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Stay ahead of technology with{" "}
            <span className="text-blue-600">AI-powered insights.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg sm:leading-8">
            Track important software developments, security vulnerabilities, AI news,
            framework updates, and developer tools in one intelligent platform.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
  onClick={() => {
    const token = localStorage.getItem("access_token");

    router.push(
      token ? "/dashboard/news" : "/login"
    );
  }}
  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
>
  Explore Latest News
</button>

            <a
              href="/register"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-gray-50 hover:shadow-lg dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Create Free Account
            </a>
          </div>

        </section>
      </FadeInSection>
      <FadeInSection>
  <section className="px-4 py-12 sm:px-6">
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-10 text-center">
  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
    PLATFORM STATISTICS
  </p>

  <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
    Trusted by Technology Professionals
  </h2>
</div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-5xl font-bold text-blue-600">
  <CountUp end={1200} duration={2.5} separator="," />+
</h3>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            Articles Collected
          </p>
        </div>

        <div
  className="
    group
    rounded-3xl
    border
    border-gray-200
    bg-white
    p-8
    text-center
    shadow-sm
    transition-all
    duration-500
    hover:-translate-y-2
    hover:border-blue-300
    hover:shadow-2xl
    dark:border-gray-700
    dark:bg-gray-800
  "
>
          <h3 className="text-5xl font-bold text-blue-600">
  <CountUp end={25} duration={2.5} />+
</h3>
          <p
  className="
    mt-3
    text-sm
    font-semibold
    uppercase
    tracking-widest
    text-gray-500
    dark:text-gray-400
  "
>
            Trusted Sources
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-5xl font-bold text-blue-600">
  <CountUp end={10} duration={2.5} />
</h3>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            Technology Categories
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-5xl font-bold text-blue-600">
  24/7
</h3>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            Powered Analysis
          </p>
        </div>

      </div>
    </div>
  </section>
</FadeInSection>
<FadeInSection>
  <section className="relative overflow-hidden bg-gray-50 px-4 py-20 dark:bg-gray-900">
    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />
    <div className="mx-auto max-w-7xl">
      

      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          HOW IT WORKS
        </p>

        <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
          How TechPulse AI Works
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          From collecting technology news to delivering personalized AI-powered
          insights — everything happens automatically.
        </p>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-4">

        <div className="group rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900 hover:scale-105 hover:shadow-blue-500/20">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 transition-all duration-500 group-hover:bg-blue-600">
  <Newspaper className="h-9 w-9 text-blue-600 group-hover:text-white" />
</div>

          <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            Collect News
          </h3>

          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
            Continuously gathers technology news, security alerts,
            AI updates and framework releases from trusted sources.
          </p>

        </div>

        <div className="group rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900 hover:scale-105 hover:shadow-blue-500/20">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 transition-all duration-500 group-hover:bg-blue-600">
  <Bot className="h-9 w-9 text-blue-600 group-hover:text-white" />
</div>

          <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            AI Analysis
          </h3>

          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
            Every article is analyzed using AI to generate summaries,
            categories, importance scores and recommendations.
          </p>

        </div>

        <div className="group rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900 hover:scale-105 hover:shadow-blue-500/20">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 transition-all duration-500 group-hover:bg-blue-600">
  <ChartColumn className="h-9 w-9 text-blue-600 group-hover:text-white" />
</div>

          <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            Smart Scoring
          </h3>

          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
            Risk levels, affected technologies and importance scores
            help prioritize the updates that matter most.
          </p>

        </div>

        <div className="group rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900 hover:scale-105 hover:shadow-blue-500/20">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 transition-all duration-500 group-hover:bg-blue-600">
  <BellRing className="h-9 w-9 text-blue-600 group-hover:text-white" />
</div>

          <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
            Personalized Alerts
          </h3>

          <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
            Receive instant notifications based on your interests,
            preferred categories and importance thresholds.
          </p>

        </div>

      </div>

    </div>
  </section>
</FadeInSection>
      <FadeInSection>
        <section

          id="features"
          className="relative overflow-hidden bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 dark:bg-gray-900"
        >
          <div className="pointer-events-none absolute right-0 top-1/2 z-0 hidden h-96 w-96 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl dark:block" />
          <div className="pointer-events-none absolute left-0 top-1/2 z-0 hidden h-96 w-96 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl dark:block" />

          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to stay ahead in tech
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              TechPulse AI collects, analyzes, and personalizes the latest technology
              developments so you can focus on what truly matters.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI-Powered Analysis
              </h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Every technology update is analyzed by AI to generate summaries,
                categories, importance scores, risk levels, affected technologies, and
                recommended actions.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Monitoring
              </h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Track critical CVEs, security vulnerabilities, and data breach notifications with AI-generated risk levels, affected technologies, and recommended actions.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Multiple Trusted Sources
              </h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Follow AI, software, cybersecurity, cloud, DevOps, and technology updates from trusted global and Turkish sources — all in one unified platform.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personalized Alerts
              </h3>

              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Receive personalized notifications based on your preferred categories,
                regions, and minimum importance score.
              </p>
            </div>
          </div>

        </section>
      </FadeInSection>
      <FadeInSection>
 <section className="relative overflow-hidden bg-gray-50 px-4 py-20 dark:bg-gray-900">
  <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />
    <div className="
absolute
left-1/2
top-1/2
-z-10
h-[450px]
w-[450px]
-translate-x-1/2
-translate-y-1/2
rounded-full
bg-blue-600/20
blur-3xl
"/>
    <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />

    <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

      {/* Left Side */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          DASHBOARD PREVIEW
        </p>

        <h2 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
          See TechPulse AI in Action
        </h2>

        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Stay on top of AI, cybersecurity,
frameworks, cloud technologies,
and software updates from one
intelligent dashboard
        </p>

        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-3">
            <span className="text-xl text-blue-600">✓</span>
            <span>AI-powered news analysis</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl text-blue-600">✓</span>
            <span>Real-time security monitoring</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl text-blue-600">✓</span>
            <span>Interactive dashboard & analytics</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl text-blue-600">✓</span>
            <span>Personalized notifications</span>
          </div>

        </div>

        <button
  onClick={() => {
    const token = localStorage.getItem("access_token");
    router.push(token ? "/dashboard" : "/login");
  }}
  className="mt-10 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
>
  Try Live Dashboard →
</button>
      </div>

      {/* Right Side */}
      <div className="relative lg:scale-110">
        <Image
  src="/images/dashboard-preview.png"
  alt="TechPulse AI Dashboard"
  width={1600}
  height={1000}
  priority
  className="
    w-full
    rounded-3xl
    border
    border-gray-200
    shadow-2xl
    transition-all
    duration-500
    hover:scale-[1.02]
    dark:border-gray-700
  "
/>
      </div>

    </div>
  </section>
</FadeInSection>
<FadeInSection>
  <section className="relative overflow-hidden bg-gray-50 px-4 py-20 dark:bg-gray-900">

    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />

    <div className="mx-auto max-w-7xl">

      <div className="text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          TRUSTED SOURCES
        </p>

        <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">
          Powered by the World's Leading Technology Platforms
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          TechPulse AI continuously monitors trusted global technology providers,
          security organizations and developer communities.
        </p>

      </div>

      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

        {[
  { icon: FaGithub, name: "GitHub" },
  { icon: FaCloudflare, name: "Cloudflare" },
  { icon: Bot, name: "OpenAI" },
  { icon: ShieldCheck, name: "NVD / CVE" },
  { icon: FaDocker, name: "Docker" },
  { icon: FaAws, name: "AWS" },
].map((item) => {
  const Icon = item.icon;

  return (
    <div
      key={item.name}
      className="group rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <Icon className="mx-auto h-10 w-10 text-blue-600 transition-transform duration-500 group-hover:scale-110" />

      <p className="mt-5 font-semibold text-gray-900 dark:text-white">
        {item.name}
      </p>
    </div>
  );
})}

      </div>

    </div>

  </section>
</FadeInSection>
      <FadeInSection>
        <section
          id="categories"
          className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Explore Categories
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Follow the technology topics that matter to you
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Discover the latest developments across artificial intelligence,
              cybersecurity, software, cloud, DevOps, mobile, and developer tools.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3">
  {[
    "Artificial Intelligence",
    "Security",
    "Software",
    "Cloud",
    "DevOps",
    "Framework",
    "Mobile",
    "Developer Tools",
    "Business",
  ].map((category) => (
    <div
      key={category}
      className="
        group
        rounded-2xl
        border
        border-gray-200
        bg-white
        px-8
        py-8
        text-center
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-blue-400
        hover:shadow-xl
        dark:border-gray-700
        dark:bg-gray-800
        dark:hover:border-blue-500
      "
    >
      <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white">
        {category}
      </h3>
    </div>
  ))}
</div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <section
          id="about"
          className="relative overflow-hidden bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 dark:bg-gray-900"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px] dark:block" />
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              About TechPulse AI
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Technology intelligence, simplified by AI
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              TechPulse AI automatically collects technology news, software updates,
              security vulnerabilities, AI developments, and developer tools from
              multiple sources. Each update is analyzed by AI to help you quickly
              understand its importance, potential risk, affected technologies, and
              recommended actions.
            </p>
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />
          <div className="mx-auto max-w-6xl rounded-3xl border border-gray-200 bg-gray-50 px-8 py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Stay informed. Stay secure. Stay ahead.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Create your account and get personalized technology news, AI-powered
              analysis, security alerts, and insights tailored to your interests.
            </p>

            <div className="mt-8">
              <a
                href="/register"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 hover:shadow-lg"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </section>
      </FadeInSection>
      <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <a
            href="/"
            className="text-2xl sm:text-xl font-bold tracking-tight text-gray-900 transition-opacity hover:opacity-80 dark:text-white"
          >
            TechPulse <span className="text-blue-600">AI</span>
          </a>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 TechPulse AI. AI-powered technology intelligence.
          </p>
        </div>
      </footer>
    </main>
  );
}