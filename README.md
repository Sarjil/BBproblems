# BBproblems

1 BBnodehops
  I solved the problem four different ways and used date to compare the speed of each. The four approaches are a basic dfs a dfs that only counts unique values, a memoization, and a dynamic programming matrix approach. The basic dfs approach is O(4**hops) time and O(hops) space.
  The memo and dp approaches both end up with O(hops*nodes) time complexity and O(hops*nodes) space complexity.
  
2. BBcurrencyexchange
  I built upon what I talked about and implemented the cache. There is an alternative version of the cache that could be implemented that would save the path it took last time and only clear the cache when a new currency trade route was added. As of now whenever a direct transfer is updated my cache will remove the shortcuts that used that direct transfer as part of their paths.
