import dynamic from 'next/dynamic'

const DynamicTestAuth = dynamic(() => import('./TestAuth'), { ssr: false })

export default function TestAuthPage() {
  return <DynamicTestAuth />
}

