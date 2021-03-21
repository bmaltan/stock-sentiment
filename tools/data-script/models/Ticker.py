from .TickerType import TickerType


class InvestTicker:
    symbol: str
    type: TickerType

    def __init__(self, symbol: str, type: TickerType) -> None:
        self.symbol = symbol
        self.type = type

    def __eq__(self, o: object) -> bool:
        if isinstance(o, str):
            return self.symbol == o
        else:
            return o == self
