import { redirect } from 'next/navigation'

const OFFER_URL = 'https://drive.google.com/file/u/6/d/1pXHmyc6lPinYpNmvGfpJ6iLJnnfTEXuz/view'

export default function OfferPage() {
  redirect(OFFER_URL)
}
