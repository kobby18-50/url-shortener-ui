import { toast } from "sonner"

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to Clipboard')
  } catch (err) {
    console.error("Failed to copy", err)
  }
}