export function checkIfFilesAreTooBig(files) {
    let valid = true
    if (files) {
        files.map(file => {
            const size = file.size / 1024 / 1024
            if (size > 10) {
                valid = false
            }
        })
    }
    return valid
}

export function checkIfFilesAreCorrectType(files) {
    let valid = true
    if (files) {
        files.map(file => {
            if (!["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(file.type)) {
                valid = false
            }
        })
    }
    return valid
}

export const validateImageType = (value) => {
    if (value) {
        let type = value.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
        return SUPPORTED_FORMATS.includes(type)
    }
}