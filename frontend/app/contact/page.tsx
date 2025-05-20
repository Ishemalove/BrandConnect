"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"

export default function ContactModal() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      subscribe: formData.get("subscribe") === "on"
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to send. Please try again.")
      setSubmitted(true)
      form.reset()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Contact Us</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        {submitted ? (
          <div className="text-green-600 text-center font-medium py-8">
            Thank you for reaching out! We'll get back to you soon.<br />
            {" "}You have also been subscribed to our newsletter if you checked the box.
            <DialogClose asChild>
              <Button className="mt-6 w-full" onClick={() => { setSubmitted(false); setOpen(false); }}>Close</Button>
            </DialogClose>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <input id="name" name="name" type="text" required placeholder="Your Name" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <input id="email" name="email" type="email" required placeholder="you@email.com" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium mb-1">Message</label>
              <textarea id="message" name="message" required placeholder="How can we help you?" className="w-full border rounded px-3 py-2 h-24" />
            </div>
            <div className="flex items-center gap-2">
              <input id="subscribe" name="subscribe" type="checkbox" className="mr-2" />
              <label htmlFor="subscribe" className="mb-0 cursor-pointer">Subscribe to our newsletter</label>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 