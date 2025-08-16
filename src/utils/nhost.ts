import { NhostClient } from '@nhost/nhost-js'

const nhostClient = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || '',
  region: import.meta.env.VITE_NHOST_REGION || '',
})

export { nhostClient }
