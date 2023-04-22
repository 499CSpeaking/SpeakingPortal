import { Image } from "canvas";

// class to obtain inputs from somewhere
// must be implemented with a concrete interface

export abstract class InputParser {
    abstract getParameter(key: string): string
    abstract getParameterOptional(key: string): string | undefined

    abstract getImage(path: string): Image
    abstract getFile(path: string): Buffer
}