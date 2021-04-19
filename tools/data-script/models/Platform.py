from .TickerType import TickerType


class Platform:
    platform: str
    display: str
    name: str
    type: TickerType

    def __init__(self, platform: str, display: str, name: str, type: TickerType):
        self.platform = platform
        self.display = display
        self.name = name
        self.type = type

    def __str__(self) -> str:
        return self.display

    def __repr__(self) -> str:
        return self.__str__()

    def __eq__(self, other: str):
        return self.display == other

    def __hash__(self):
        return hash(self.display + self.platform)
