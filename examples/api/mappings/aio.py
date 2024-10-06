import audiogen_io

format = {
    "source": "str",
    "amount": "int",
    "random": "bool",
    "query": "str (odata query)"
}
def map_fn(operation: dict):
    if operation['random']:
        def exe():
            item = audiogen_io.random_selector([operation['source']]).get_random()[0]
            return item.item
    else:
        def exe():
            query = [{ 
                "source": operation['source'], 
                "amount": operation['amount'], 
                "query": operation['query'] if "query" in operation and operation['query'] else None
            }]
                
            print(query)
            list = [item.item for item in audiogen_io.select(query).apply()]
            return list
    return exe


mapping = {
    "fn": map_fn,
    "format": format,
    "name": "audiogen_io"
}
