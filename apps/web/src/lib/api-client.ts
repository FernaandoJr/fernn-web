import axios, { type AxiosInstance } from "axios"
import { toast } from "sonner"

import { getApiV1Url } from "@/auth/config"
import { clearAccessToken, getToken } from "@/auth/storage"
import { getClientMessage } from "@/lib/client-messages"

export type ApiClientOptions = {
  /** Skip redirect/toast on 401 for auth sign-in/sign-up requests */
  skipUnauthorizedRedirect?: (url: string | undefined) => boolean
  onUnauthorized?: () => void
}

export function createApiClient(options: ApiClientOptions = {}): AxiosInstance {
  const client = axios.create({
    baseURL: getApiV1Url(),
    headers: {
      "Content-Type": "application/json",
    },
  })

  client.interceptors.request.use((config) => {
    if (typeof window === "undefined") return config
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        const url = String(error.config?.url ?? "")
        const skip = options.skipUnauthorizedRedirect?.(url) ?? false
        if (!skip) {
          clearAccessToken()
          options.onUnauthorized?.()
          toast.error(getClientMessage("auth.sessionExpired"))
          window.location.href = "/auth/sign-in"
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const apiClient = createApiClient({
  skipUnauthorizedRedirect: (url) =>
    (url ?? "").includes("sign-in") || (url ?? "").includes("sign-up"),
})
