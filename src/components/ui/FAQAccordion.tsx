'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-4">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="rounded-2xl bg-neutral-50 border border-neutral-200 overflow-hidden data-[state=open]:border-neutral-300"
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-left group">
              <span className="font-semibold text-neutral-900 pr-4">
                {item.question}
              </span>
              <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-6 pb-6 pt-0 text-neutral-600">
              {item.answer}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
