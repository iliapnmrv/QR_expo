import { CHANGE_OWNERS_DATA, CHANGE_PERSONS_DATA, CHANGE_STATUSES_DATA, CHANGE_STORAGES_DATA } from "../actions/infoAction";

const defaultState = {
    storages: [],
    statuses: [],
    persons: [],
    owners: [],
};

export const infoReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case CHANGE_STORAGES_DATA:
            return {...state,
                storages: payload.map((row) => ({
                    label: `${row.storage_name}`,
                    value: row.storage_id,
                }))
            };
        case CHANGE_STATUSES_DATA:
            return {...state,
                statuses: payload.map((row) => ({
                    label: `${row.status_name}`,
                    value: row.status_id,
                }))
            };
        case CHANGE_PERSONS_DATA:
            return {...state,
                persons: payload.map((row) => ({
                    label: `${row.person_name}`,
                    value: row.person_id,
                }))
            };
        case CHANGE_OWNERS_DATA:
            return {...state,
                owners: payload.map((row) => ({
                    label: `${row.owner_name}`,
                    value: row.owner_id,
                }))
            };
        default:
            return state;
    }
};