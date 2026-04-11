"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  ClipboardCheck,
  MapPin,
  Calendar,
  Box,
} from "lucide-react"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Heading } from "@/components/shared/heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const trackingSteps = [
  {
    key: "placed",
    label: "Order Placed",
    description: "Your order has been received and payment confirmed.",
    icon: ClipboardCheck,
    date: "March 18, 2026 · 10:24 AM",
    completed: true,
  },
  {
    key: "processing",
    label: "Processing",
    description: "Items are being prepared and quality-checked.",
    icon: Box,
    date: "March 18, 2026 · 2:15 PM",
    completed: true,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is en route with our courier partner.",
    icon: Truck,
    date: "March 19, 2026 · 9:30 AM",
    completed: true,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been successfully delivered.",
    icon: CheckCircle2,
    date: "March 20, 2026 · 11:45 AM",
    completed: false,
  },
]

const packageDetails = {
  orderNumber: "FF-7K3F-A2XN",
  items: [
    { name: "Girls Ankara Flare Dress", variant: "Age 6-7", qty: 1 },
    { name: "Boys Ankara Occasion Set", variant: "Size M", qty: 1 },
  ],
  estimatedDelivery: "March 20–21, 2026",
  courier: "GHS Express",
  trackingNumber: "GEX-4829173650",
}

export default function TrackOrderPage() {
  const [isTracking, setIsTracking] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [contact, setContact] = useState("")

  const handleTrack = () => {
    if (orderNumber.trim() && contact.trim()) {
      setIsTracking(true)
    }
  }

  return (
    <Section className="min-h-screen bg-gradient-to-b from-rose-light/50 to-white">
      <Container>
        <Heading
          as="h1"
          align="center"
          subtitle="Enter your order details below to see real-time updates on your delivery."
        >
          Track Your Order
        </Heading>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-xl"
        >
          <Card className="rounded-3xl border-rose-border/50 ring-0 shadow-sm border">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <div className="space-y-2">
                <Label htmlFor="trackOrderNumber">Order Number</Label>
                <Input
                  id="trackOrderNumber"
                  placeholder="e.g. FF-7K3F-A2XN"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="h-11 rounded-xl border-rose-border text-base focus-visible:border-rose-primary focus-visible:ring-rose-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackContact">Email or Phone</Label>
                <Input
                  id="trackContact"
                  placeholder="you@example.com or +233..."
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="h-11 rounded-xl border-rose-border text-base focus-visible:border-rose-primary focus-visible:ring-rose-primary/20"
                />
              </div>
              <Button
                onClick={handleTrack}
                className="w-full gap-2 rounded-xl bg-rose-primary py-3 text-white hover:bg-rose-primary/90"
              >
                <Search className="size-4" />
                Track Order
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tracking Result */}
        <AnimatePresence>
          {isTracking && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              className="mx-auto mt-12 max-w-2xl"
            >
              {/* Status Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-50">
                  <Truck className="size-7 text-blue-600" />
                </div>
                <h2 className="mt-4 font-heading text-xl font-semibold text-navy">
                  Your Order is On Its Way
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estimated delivery:{" "}
                  <span className="font-medium text-navy">
                    {packageDetails.estimatedDelivery}
                  </span>
                </p>
              </div>

              {/* Visual Timeline */}
              <Card className="rounded-3xl border-rose-border/50 ring-0 shadow-sm border">
                <CardContent className="p-6 sm:p-8">
                  <div className="relative">
                    {trackingSteps.map((step, i) => {
                      const isLast = i === trackingSteps.length - 1
                      const StepIcon = step.icon

                      return (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + i * 0.15,
                            duration: 0.4,
                          }}
                          className="relative flex gap-4 pb-8 last:pb-0"
                        >
                          {/* Line */}
                          {!isLast && (
                            <div
                              className={cn(
                                "absolute left-5 top-10 h-[calc(100%-20px)] w-0.5",
                                step.completed
                                  ? "bg-rose-primary"
                                  : "bg-rose-border/60"
                              )}
                            />
                          )}

                          {/* Icon */}
                          <div
                            className={cn(
                              "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                              step.completed
                                ? "bg-rose-primary text-white"
                                : "border-2 border-rose-border bg-white text-muted-foreground"
                            )}
                          >
                            <StepIcon className="size-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-0.5">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <h3
                                className={cn(
                                  "font-heading font-semibold",
                                  step.completed
                                    ? "text-navy"
                                    : "text-muted-foreground"
                                )}
                              >
                                {step.label}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {step.completed ? step.date : "Pending"}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Package Details */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Card className="mt-6 rounded-3xl border-rose-border/50 ring-0 shadow-sm border">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2">
                      <Package className="size-5 text-rose-primary" />
                      <h3 className="font-heading font-semibold text-navy">
                        Package Details
                      </h3>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Order Number
                        </p>
                        <p className="mt-0.5 font-medium text-navy">
                          {packageDetails.orderNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Courier
                        </p>
                        <p className="mt-0.5 font-medium text-navy">
                          {packageDetails.courier}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Tracking Number
                        </p>
                        <p className="mt-0.5 font-medium text-navy">
                          {packageDetails.trackingNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Estimated Delivery
                        </p>
                        <p className="mt-0.5 font-medium text-navy">
                          {packageDetails.estimatedDelivery}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-5 bg-rose-border/40" />

                    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Items in This Shipment
                    </h4>
                    <div className="mt-3 space-y-3">
                      {packageDetails.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-pink-50">
                              <Package className="size-4 text-rose-primary/50" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.variant}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Section>
  )
}
