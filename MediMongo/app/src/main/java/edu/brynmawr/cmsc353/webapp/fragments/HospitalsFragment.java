package edu.brynmawr.cmsc353.webapp.fragments;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import edu.brynmawr.cmsc353.webapp.R;
import edu.brynmawr.cmsc353.webapp.adapters.HospitalAdapter;
import edu.brynmawr.cmsc353.webapp.models.Hospital;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link HospitalsFragment#newInstance} factory method to
 * create an instance of this fragment.
 *
 */
public class HospitalsFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    public List<Hospital> hospitals;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private RecyclerView rvHospitals;
    protected HospitalAdapter adapter;

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HospitalsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static HospitalsFragment newInstance(String param1, String param2) {
        HospitalsFragment fragment = new HospitalsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    public HospitalsFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_hospitals, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Lookup the recyclerview in activity layout
        rvHospitals = view.findViewById(R.id.rvHospitals);
        hospitals = new ArrayList<>();
        // Create adapter passing in the sample user data
        adapter = new HospitalAdapter(getContext(), hospitals);
        // Attach the adapter to the recyclerview to populate items
        rvHospitals.setAdapter(adapter);
        // Attach the layout manager to the recycler view
        rvHospitals.setLayoutManager(new LinearLayoutManager(getContext()));

        // Now we retrieve data
        try {
            ArrayList<String[]> myEntries = new ArrayList<>();
            InputStreamReader is = new InputStreamReader(getContext().getAssets()
                    .open("hospitals.csv"));

            BufferedReader reader = new BufferedReader(is);
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {
                myEntries.add(line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"));
            }

            hospitals.addAll(Hospital.getHospitals(getContext(), myEntries));

            adapter.notifyDataSetChanged();

        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            System.out.println("File Not Found");
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}