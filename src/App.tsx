import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { useEffect, useState } from 'react'
import axios from 'axios'
import URLCard from './components/ui/UrlCard'
import { useFormik } from 'formik'
import { urlValidationSchema } from './components/schema/urlSchema'
import type { ShortenUrl } from './interfaces'
import { Spinner } from './components/ui/spinner'
import { toast } from 'sonner'
import { BASE_URL } from './baseUrl'

function App() {
  const [shortenedUrls, setShortenedUrls] = useState([] as ShortenUrl[])
  const [isLoading, setIsLoading] = useState(false)

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
      setIsLoading(true)
      const data = { longUrl }
      await axios
        .post(`${BASE_URL}/shorten`, data)
        .then((res) => {
          console.log(res)
          setIsLoading(false)
          toast.success('Url shortened successfully')
        })
        .catch((err) => {
          console.log(err)
          setIsLoading(false)
          toast.error('Error shortening url')
        })
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${BASE_URL}/urls/all`)
      const data = response.data

      setShortenedUrls(data)
    }

    fetchData()
  }, [shortenedUrls])
  return (
    <main className='flex flex-col gap-5 justify-center p-5 container'>
      <h1 className='text-[#fe611d] text-4xl font-bold text-center'>
        Shorten your <span className='text-[#009dff] py-5'>loooooong</span> URLs{' '}
        <br /> like never before!
      </h1>

      <p className='text-center text-sm'>
        Copy your long boring url. Paste it below
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col'>
        <div className='flex justify-center w-[37%]'>
          <span className='text-sm'>Your long url</span>
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

          {isLoading ? (
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

          <div className='grid md:grid-cols-3 gap-5 '>
            {shortenedUrls.map((shortenedUrl, _) => (
              <URLCard key={shortenedUrl.shortCode} url={shortenedUrl} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

export default App
