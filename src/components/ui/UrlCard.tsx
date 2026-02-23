import { ClipboardCopy, ExternalLink, Eye, Trash } from 'lucide-react'
import { Card, CardContent, CardFooter } from './card'
import type { ShortenUrl } from '@/interfaces'
import { Spinner } from './spinner'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/copyToClipboard'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUrl } from '../api-helpers'

type URLCardProp = {
  url: ShortenUrl
}

const URLCard = ({ url }: URLCardProp) => {
  const { clicks, longUrl, shortUrl, shortCode } = url

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUrl,
    onSuccess: () => {
      toast.success('Url deleted')
      queryClient.invalidateQueries({ queryKey: ['urls'] })
    },
    onError: () => {
      toast.error('Errror deleting url')
    },
  })

  const handleDelete = async (shortCode: string) => {
    mutate(shortCode)
  }
  return (
    <Card>
      <CardContent className='flex flex-col gap-5'>
        <p>{longUrl.substring(0,20)}</p>

        <div className='flex gap-x-2 items-center '>
          <a
            target='_blank'
            className='font-semibold flex items-center gap-2'
            href={shortUrl}
          >
            <span className='text-[#009dff]'>{shortUrl.substring(0, 30)}</span>
            <span>
              <ExternalLink size={15} className='text-[#fe611d]' />
            </span>
          </a>
          <p></p>
        </div>
      </CardContent>

      <CardFooter className='flex justify-between text-xs'>
        <span className='flex items-center text-sm gap-2'>
          <span>
            <Eye size={15} />
          </span>
          <span>{clicks}</span>
        </span>

        <span className='flex gap-x-3'>
          <button
            className='hover:cursor-pointer'
            onClick={() => copyToClipboard(shortUrl)}
          >
            <ClipboardCopy size={15} />
          </button>

          {isPending ? (
            <Spinner />
          ) : (
            <button
              className='hover:cursor-pointer'
              onClick={() => handleDelete(shortCode)}
            >
              <Trash className='text-red-900' size={15} />
            </button>
          )}
        </span>
      </CardFooter>
    </Card>
  )
}

export default URLCard
