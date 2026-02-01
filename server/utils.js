import randomColor from "randomcolor"

export const generateUser = (username) => {
    return {
        name: username,
        color: randomColor({ luminosity: "dark" }),
    }
}