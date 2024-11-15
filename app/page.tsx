'use client'

import Link from "next/link"
import { ArrowRight, Clock, Eye, BarChart } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const fadeIn: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
}

const stagger: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-green-100 relative">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/landing.mp4" type="video/mp4" />
      </video>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen bg-gradient-to-b from-green-50/90 to-green-100/90">
        <header className="px-4 lg:px-6 h-14 flex items-center backdrop-blur-md bg-green-200">
          <Link className="flex items-center justify-center" href="#">
            <span className="ml-2 text-lg font-semibold text-green-800">PortMan</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4 text-green-700 hover:translate-y-[-2px]" href="/login">
              Login
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4 text-green-700 hover:translate-y-[-2px]" href="/register">
              Register
            </Link>
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="container px-4 md:px-6">
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <motion.div variants={fadeIn} className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-green-800">
                    Welcome to PortMan
                  </h1>
                  <p className="mx-auto max-w-[700px] text-green-700 md:text-xl">
                    Streamline your property management with real-time updates and efficient database solutions for brokers and agents.
                  </p>
                </motion.div>
                <motion.div variants={fadeIn} className="space-x-4">
                  <Button asChild className="bg-green-600 text-white hover:bg-green-700 transition-colors">
                    <Link href="/register">Register Now</Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-green-600 border-green-600 hover:bg-green-600/20">
                    <Link href="/login">Login</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600/10 backdrop-blur-md">
            <div className="container px-4 md:px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-green-800"
              >
                Key Features
              </motion.h2>
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {[
                  { icon: Clock, title: "Real-time Updates", description: "Stay informed with instant property and client information updates." },
                  { icon: Eye, title: "Property Viewing", description: "Easily view and manage your property portfolio in one place." },
                  { icon: BarChart, title: "Performance Tracking", description: "Monitor your sales performance and identify growth opportunities." }
                ].map((feature, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="border-0 shadow-lg bg-green-600/20 backdrop-blur-md">
                      <CardHeader>
                        <feature.icon className="h-6 w-6 mb-2 text-green-700" />
                        <CardTitle className="text-green-800">{feature.title}</CardTitle>
                        <CardDescription className="text-green-700">{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={stagger}
                className="flex flex-col items-center justify-center space-y-4 text-center"
              >
                <motion.div variants={fadeIn} className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-green-800">Ready to Simplify Your Workflow?</h2>
                  <p className="max-w-[600px] text-green-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join PortMan today and experience the power of efficient property management.
                  </p>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Button asChild className="flex items-center bg-green-600 text-white hover:bg-green-700 transition-colors">
                    <Link href="/register">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-green-600/10 backdrop-blur-md bg-green-600/10">
          <p className="text-xs text-green-700">© 2024 PortMan. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-green-700" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-green-700" href="#">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}