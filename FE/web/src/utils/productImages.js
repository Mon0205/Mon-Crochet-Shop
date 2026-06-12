export const getImageUrl = (image) => (typeof image === 'string' ? image : image?.url || '')

export const getImageKey = (image) => {
  if (typeof image === 'string') return image
  return image?.publicId || image?.url || ''
}
