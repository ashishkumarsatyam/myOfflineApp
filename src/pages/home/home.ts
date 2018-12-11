import { Component } from '@angular/core';
import { NavController, Refresher } from 'ionic-angular';
import { CacheService, Cache } from 'ionic-cache-observable'
import { PlaceholderProvider, Placeholder } from '../../providers/placeholder/placeholder'
import { Observable } from 'rxjs/observable';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public data: Observable<Placeholder>;
  private cache: Cache<Placeholder>;
  constructor(public navCtrl: NavController, placeholderProvider: PlaceholderProvider, cacheService: CacheService) {
// The data we want to display on the page. 
    // This could be a user's profile or his list of todo items.
    const dataObservable = placeholderProvider.random();
    // We register a cache instance, using a unique name 
    // so the CacheService will know what data to display next time.
    cacheService.register('home', dataObservable)
      .subscribe((cache) => {
        console.log(cache.get$);
       // Save the cache object.
       this.cache = cache;
       this.data = this.cache.get$;
      });
  } 

  onRefresh(refresher: Refresher): void {
    // Check if the cache has registered.
    if (this.cache) {
      this.cache.refresh().subscribe(() => {
        // Refresh completed, complete the refresher animation.
        refresher.complete();
      }, (err) => {
        // Something went wrong! 
        // Log the error and cancel refresher animation.
        console.error('Refresh failed!', err);
        refresher.cancel();
      });
    } else {
      // Cache is not registered yet, so cancel refresher animation.
      refresher.cancel();
    }
  }

}
