/**
 * Shared state for pre-filling the contact form from other sections.
 * Set `subject` before scrolling to #contact and the form will populate automatically.
 */
const subject = ref('')

export const useContactPrefill = () => {
    const prefill = (value: string) => { subject.value = value }
    const clear   = () => { subject.value = '' }
    return { subject, prefill, clear }
}
