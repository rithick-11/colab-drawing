import { uniqueNamesGenerator, animals } from 'unique-names-generator';
import randomColor from "randomcolor"

export const generateUser = () => {
    const username = uniqueNamesGenerator({
        dictionaries: [animals],
        length: 1,
        separator: "",
    });
    return {
        name: username,
        color: randomColor({ luminosity: "dark" }),
    }
}