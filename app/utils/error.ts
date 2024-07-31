interface ServerErrorProps {
  message: string
  status: number
  context?: string
}
export class ServerError<
  T extends ServerErrorProps = ServerErrorProps
> extends Error {
  public readonly status
  public readonly context
  public readonly customProps: Omit<T, 'message' | 'status' | 'context'>

  constructor({ message, status, context = undefined, ...props }: T) {
    super(message)
    this.status = status
    this.context = context
    this.customProps = props
  }
}
