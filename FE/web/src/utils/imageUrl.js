const isCloudinaryUrl = (url = '') => url.includes('res.cloudinary.com') && url.includes('/upload/')

export const getCloudinaryImage = (url, transform = 'f_auto,q_auto:best,c_fill,g_auto,w_900,h_675') => {
  if (!url || !isCloudinaryUrl(url)) return url
  return url.replace('/upload/', `/upload/${transform}/`)
}

export const productCardImage = (url) => getCloudinaryImage(url, 'f_auto,q_auto:best,c_fit,w_900,h_675')

export const squareThumbImage = (url, size = 320) =>
  getCloudinaryImage(url, `f_auto,q_auto:best,c_fit,w_${size},h_${size}`)
