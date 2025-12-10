import { useAuth } from "@clerk/nextjs";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions extends RequestInit {
    // Add any custom options here if needed in the future
}

export const useApi = () => {
    const { getToken } = useAuth();

    // Default to localhost:3001 if env var is not set, or use empty string if you want relative paths by default
    // Adjust this based on your preference. Using a relative path or an env var is best.
    // We'll use the env var NEXT_PUBLIC_API_URL, and fallback to http://localhost:3001
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const request = async <T>(
        endpoint: string,
        method: HttpMethod,
        body?: any,
        options?: ApiOptions
    ): Promise<T> => {
        const token = await getToken();

        // Ensure endpoint starts with / if it's a path, or handle absolute URLs
        const isAbsolute = endpoint.startsWith("http");
        const url = isAbsolute ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        };

        const config: RequestInit = {
            ...options,
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized specifically if needed, likely handled by the app's auth flow but good to know
            if (response.status === 401) {
                console.warn("API Request Unauthorized");
                // Could trigger a redirect or auth modal here if needed
            }

            if (!response.ok) {
                // Try to parse error message from body
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    // Ignore JSON parse error on error response
                }
                throw new Error(errorMessage);
            }

            // Check if response has content before trying to parse JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            }

            // Return text or null/undefined if not JSON
            // We cast to T, assuming the caller knows what to expect (e.g. void if 204)
            return (await response.text()) as unknown as T;

        } catch (error) {
            console.error("API Request Failed:", error);
            throw error;
        }
    };

    return {
        get: <T>(endpoint: string, options?: ApiOptions) => request<T>(endpoint, "GET", undefined, options),
        post: <T>(endpoint: string, body: any, options?: ApiOptions) => request<T>(endpoint, "POST", body, options),
        put: <T>(endpoint: string, body: any, options?: ApiOptions) => request<T>(endpoint, "PUT", body, options),
        delete: <T>(endpoint: string, options?: ApiOptions) => request<T>(endpoint, "DELETE", undefined, options),
    };
};
