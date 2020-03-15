export interface InterpolateParameters {
  [variableName: string]: string;
}

export interface DirectoryParameters {
  [dir: string]: InterpolateParameters
}
