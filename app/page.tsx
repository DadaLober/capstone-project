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
      <div className="relative z-10 flex flex-col min-h-screen bg-gradient-to-b from-teal-100 to-transparent">
        <header className="px-4 lg:px-6 h-16 flex items-center backdrop-blur-md bg-white/50 border-b border-green-200/50 sticky top-0 z-50">
          <Link className="flex items-center justify-center" href="#">
            <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">PortMan</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:text-green-600 transition-colors" href="/login">
              Login
            </Link>
            <Link className="text-sm font-medium hover:text-green-600 transition-colors" href="/register">
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
          <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-50">
            <div className="container px-4 md:px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600"
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
                    <Card className="group hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-green-50 border-none">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-300">
                          <feature.icon className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-green-800 group-hover:text-green-600 transition-colors duration-300">{feature.title}</CardTitle>
                        <CardDescription className="text-green-700">{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-100">
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
        <footer className="w-full py-6 bg-white border-t border-green-200">
          <div className="container px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-green-600">© 2024 PortMan. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
              <Link className="text-sm hover:underline underline-offset-4 text-green-600 hover:text-emerald-600 transition-colors" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm hover:underline underline-offset-4 text-green-600 hover:text-emerald-600 transition-colors" href="#">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  )
}