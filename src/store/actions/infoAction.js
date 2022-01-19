export const CHANGE_STORAGES_DATA = "CHANGE_STORAGES_DATA"
export const CHANGE_STATUSES_DATA = "CHANGE_STATUSES_DATA"
export const CHANGE_PERSONS_DATA = "CHANGE_PERSONS_DATA"
export const CHANGE_OWNERS_DATA = "CHANGE_OWNERS_DATA"

export const changeStoragesData = (payload) => {
    return {
        type: CHANGE_STORAGES_DATA,
        payload
    }
}
export const changeStatusesData = (payload) => {
    return {
        type: CHANGE_STATUSES_DATA,
        payload
    }
}
export const changePersonsData = (payload) => {
    return {
        type: CHANGE_PERSONS_DATA,
        payload
    }
}
export const changeOwnersData = (payload) => {
    return {
        type: CHANGE_OWNERS_DATA,
        payload
    }
}