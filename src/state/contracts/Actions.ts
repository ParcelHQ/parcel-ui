import { CREATE_ORGANIZATION } from './Constants';

export const createOrganization = (value: boolean) => {
    return {
        type: CREATE_ORGANIZATION,
        value,
    };
};
