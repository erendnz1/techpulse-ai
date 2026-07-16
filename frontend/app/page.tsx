import { ThemeToggle } from "@/components/theme-toggle";
import { FadeInSection } from "./fade-in-section";
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <nav className="flex items-center justify-between border-b border-gray-200 px-8 py-5 dark:border-gray-800">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900 transition-opacity hover:opacity-80 dark:text-white"
        >
          TechPulse <span className="text-blue-600">AI</span>
        </a>

        <div className="flex items-center gap-10 text-base font-semibold text-gray-700 dark:text-gray-200">
          <a href="#features"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Features</a>
          <a href="#categories"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Categories</a>
          <a href="#about"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            About</a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <a
            href="/login"
            className="text-base font-semibold text-gray-700 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
          >
            Sign In
          </a>

          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
          >
            Get Started
          </a>
        </div>
      </nav>
      <FadeInSection>
        <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl dark:block" />
          {/* Light mode - left edge glow */}
          <div className="pointer-events-none absolute -left-64 top-1/2 z-0 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-200/60 blur-3xl dark:hidden" />

          {/* Light mode - right edge glow */}
          <div className="pointer-events-none absolute -right-64 top-1/2 z-0 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-200/60 blur-3xl dark:hidden" />

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Stay ahead of technology with{" "}
            <span className="text-blue-600">AI-powered insights.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Track important software developments, security vulnerabilities, AI news,
            framework updates, and developer tools in one intelligent platform.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <a
              href="#latest-news"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
            >
              Explore Latest News
            </a>

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
        <section

          id="features"
          className="relative overflow-hidden bg-gray-50 px-6 py-24 dark:bg-gray-900"
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
        <section
          id="categories"
          className="relative overflow-hidden px-6 py-24"
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
          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              "Artificial Intelligence",
              "Security",
              "Software",
              "Cloud",
              "DevOps",
              "Mobile",
              "Developer Tools",
              "Business",
            ].map((category) => (
              <div
                key={category}
                className="rounded-xl border border-gray-200 bg-white p-5 text-center font-semibold text-gray-800 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500"
              >
                {category}
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <section
          id="about"
          className="relative overflow-hidden bg-gray-50 px-6 py-24 dark:bg-gray-900"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl dark:block" />
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
        <section className="relative overflow-hidden px-6 py-24">
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
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 transition-opacity hover:opacity-80 dark:text-white"
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