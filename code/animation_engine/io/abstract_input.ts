import { Image } from "canvas";

// class to obtain inputs from somewhere
// must be implemented with a concrete interface

export abstract class InputParser {
    abstract getParameter(key: string): string
    abstract getImage(path: string): Image
}