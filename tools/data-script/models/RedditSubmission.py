
class RedditSubmission:
    score: int
    id: str
    title: str
    awards: int

    def __init__(self, score: int, id: str, title: str, awards: int) -> None:
        self.score = score
        self.id = id
        self.title = title
        self.awards = awards
