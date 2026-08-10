import { FetchError } from 'ofetch'

/**
 * Thrown by submitCmsForm. `fieldErrors` is keyed by CMS field key — the keys
 * match this app's input names, so it can be passed straight to vee-validate's
 * setErrors.
 */
export class CmsFormError extends Error {
	fieldErrors: Record<string, string | string[]>
	status?: number

	constructor(message: string, fieldErrors: Record<string, string | string[]> = {}, status?: number) {
		super(message)
		this.name = 'CmsFormError'
		this.fieldErrors = fieldErrors
		this.status = status
	}
}

export function useCmsForms() {
	const { public: { cmsBase, cmsSite } } = useRuntimeConfig()

	async function submitCmsForm(formName: string, values: Record<string, unknown>): Promise<void> {
		// Omit empty optional fields — the CMS validates present keys against
		// type rules (tel regex, url) that reject empty strings.
		const body: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(values)) {
			if (value === '' || value === null || value === undefined) continue
			body[key] = value
		}

		try {
			await $fetch(`${cmsBase}/api/sites/${cmsSite}/form/${formName}`, {
				method: 'POST',
				body,
			})
		}
		catch (err) {
			if (err instanceof FetchError && err.status === 422 && err.data?.errors) {
				throw new CmsFormError(
					err.data.message ?? 'Please check the highlighted fields.',
					err.data.errors,
					422,
				)
			}
			const status = err instanceof FetchError ? err.status : undefined
			throw new CmsFormError('Something went wrong — please try again.', {}, status)
		}
	}

	return { submitCmsForm }
}
