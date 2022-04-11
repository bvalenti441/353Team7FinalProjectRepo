package edu.brynmawr.cmsc353.webapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.os.Bundle;
import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import edu.brynmawr.cmsc353.webapp.fragments.EditFragment;
import edu.brynmawr.cmsc353.webapp.fragments.HospitalsFragment;
import edu.brynmawr.cmsc353.webapp.fragments.ProfileFragment;
import edu.brynmawr.cmsc353.webapp.fragments.RecordsFragment;

public class MainActivity extends AppCompatActivity {

    public static final String TAG = "MainActivity";

    final FragmentManager fragmentManager = getSupportFragmentManager();
    public static BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                Fragment fragment;
                switch (item.getItemId()) {
                    case R.id.action_hospitals:
                        fragment = new HospitalsFragment();
                        break;
                    case R.id.action_records:
                        fragment = new RecordsFragment();
                        break;
                    case R.id.action_edit:
                        fragment = new EditFragment();
                        break;
                    case R.id.action_profile:
                    default:
                        fragment = new ProfileFragment();
                        break;
                }
                fragmentManager.beginTransaction().replace(R.id.flContainer, fragment).commit();
                return true;
            }
        });
        bottomNavigationView.setSelectedItemId(R.id.action_profile);
    }

    protected String message;




    /*public void onConnectButtonClick(View v) {

        TextView tv = findViewById(R.id.statusField);

        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                try {
                    // assumes that there is a server running on the AVD's host on port 3000
                    // and that it has a /test endpoint that returns a JSON object with
                    // a field called "message"

                    URL url = new URL("http://10.0.2.2:3000/test");

                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    conn.connect();

                    Scanner in = new Scanner(url.openStream());
                    String response = in.nextLine();

                    JSONObject jo = new JSONObject(response);

                    // need to set the instance variable in the Activity object
                    // because we cannot directly access the TextView from here
                    message = jo.getString("message");

                }
                catch (Exception e) {
                    message = e.toString();
                }
            }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            tv.setText(message);
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            tv.setText(e.toString());
        }


    }*/

    /*
    This implementation uses AsyncTasks, which are now deprecated.

    public void onConnectButtonClick(View v) {

        TextView tv = findViewById(R.id.statusField);

        try {
            // assumes that there is a server running on the AVD's host on port 3000
            // and that it has a /test endpoint that returns a JSON object with
            // a field called "message"
            URL url = new URL("http://10.0.2.2:3000/test");

            AccessWebTask task = new AccessWebTask();
            task.execute(url);
            
            String message = task.get();
            tv.setText(message);

        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            tv.setText(e.toString());
        }


    }

     */
}