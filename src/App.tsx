import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import URLCard from './components/ui/UrlCard'
import { useFormik } from 'formik'
import { urlValidationSchema } from './components/schema/urlSchema'
import type { ShortenUrl } from './interfaces'
import { Spinner } from './components/ui/spinner'
import { toast } from 'sonner'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUrls, shortenUrl } from './components/api-helpers'

function App() {
  const { data: shortenedUrls = [], isLoading } = useQuery<ShortenUrl[]>({
    queryKey: ['urls'],
    queryFn: fetchUrls,
  })

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: shortenUrl,
    onSuccess: () => {
      toast.success('Url shortened successfully')
      queryClient.invalidateQueries({ queryKey: ['urls'] })
    },
    onError: () => {
      toast.error('Error shortening url')
    },
  })

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    handleBlur,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      longUrl: '',
    },
    validationSchema: urlValidationSchema,
    onSubmit: async ({ longUrl }) => {
      mutate(longUrl)
    },
  })

  return (
    <main className='flex flex-col gap-5 justify-center p-5 container '>
      <h1 className='text-[#fe611d] text-4xl font-bold text-center'>
        Shorten your <span className='text-[#009dff] py-5'>loooooong</span> URLs{' '}
        <br /> like never before!
      </h1>

      <p className='text-center text-sm'>
        Copy your long boring url. Paste it below
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col'>
        <div className='flex justify-center w-[37%]'>
          <span className='text-xs'>Your long url</span>
        </div>

        <div className='flex items-center justify-center gap-2'>
          <Input
            onChange={handleChange}
            value={values.longUrl}
            required
            name='longUrl'
            onBlur={handleBlur}
            className='w-[60%] p-5'
            placeholder='https://yoursite.com/this-is-a-very-large-url-but-boring-and-very-long-kinda-run-out-of-words'
          />

          {isPending ? (
            <Button variant='secondary' className='p-5' disabled>
              Generating
              <Spinner data-icon='inline-start' />
            </Button>
          ) : (
            <Button
              type='submit'
              disabled={!isValid || !dirty}
              className='bg-[#fe611d] p-5'
            >
              Shorten url
            </Button>
          )}
        </div>
        {errors.longUrl && touched.longUrl && (
          <p className='text-center justify-center bg-red-100 mx-auto text-sm text-red-500  p-1 rounded-md mt-2'>
            {errors.longUrl}
          </p>
        )}

        <p className='text-xs text-center pt-2'>
          React and Nestjs powered url shortener
        </p>
      </form>

      {shortenedUrls.length > 0 && (
        <div className='flex flex-col gap-5'>
          <p className='text-center'>Here are your shortened URLs</p>

          {isLoading ? <Spinner/> : <div className='grid md:grid-cols-3 gap-5 '>
            {shortenedUrls.map((shortenedUrl, _) => (
              <URLCard key={shortenedUrl.shortCode} url={shortenedUrl} />
            ))}
          </div>}
        </div>
      )}
    </main>
  )
}

export default App
